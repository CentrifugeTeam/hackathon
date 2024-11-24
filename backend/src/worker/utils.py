from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase
from typing import Generic, TypeVar

from web.app.utils.email_sender import SMTPMessage
from .parser_pdf.parser import Row
from .settings import settings as conf_settings

from storage.db.models import EventType, SportEvent, AgeGroup, Location, Competition, Users
from logging import getLogger

smtp_message = SMTPMessage(sender=conf_settings.SMTP_SENDER, host=conf_settings.SMTP_HOST,
                           port=conf_settings.SMTP_PORT,
                           password=conf_settings.SMTP_PASSWORD)

logger = getLogger(__name__)

DBModel = TypeVar('DBModel', bound=DeclarativeBase)


async def update_db(sessionmaker, rows: list[Row]):
    async with sessionmaker() as session:
        session: AsyncSession
        for row in rows:
            await save_event_and_related_data(session, row)
            # await _handle_row(session, row)


async def _create_if_dont_exist[DBModel](session: AsyncSession, _dict: dict, model: type[DBModel]) -> DBModel:
    stmt = select(model)
    for key, value in _dict.items():
        if isinstance(value, str):
            value = value.strip()

        model_key = getattr(model, key)
        stmt = stmt.where(model_key == value)

    obj = await session.scalar(stmt)
    if obj is None:
        return await _create_model(session, _dict, model)

    return obj


async def _create_model(session, _dict, model):
    obj = model(**_dict)
    session.add(obj)
    await session.commit()
    return obj


async def save_event_and_related_data(session: AsyncSession, row: Row):
    try:
        # Сначала сохраняем или получаем существующее место

        location = await _create_if_dont_exist(session, row.location.model_dump(by_alias=True), Location)

        # Теперь создаем или находим EventType
        stmt = select(EventType).where(EventType.sport == row.event_type.sport)
        event_type = await session.scalar(stmt)
        if event_type is None:
            event_type = await _create_model(session, {**row.event_type.model_dump(by_alias=True)}, EventType)

        stmt = select(SportEvent).where(SportEvent.id == row.event.id)
        event = await session.scalar(stmt)
        if event is None:
            event = await _create_model(session, {**row.event.model_dump(by_alias=True), 'location_id': location.id,
                                                  'type_event_id': event_type.id}, SportEvent)

        # Сохраняем возрастные группы (AgeGroup)
        for sex in row.sexes:
            await _create_if_dont_exist(session, {**sex.model_dump(by_alias=True), 'event_id': event.id}, AgeGroup)

        # Сохраняем дисциплины (Competition)
        for competition in row.competitions:
            stmt = select(Competition).where(Competition.name == competition.name).where(
                Competition.type == competition.type)
            obj = await session.scalar(stmt)
            if obj is None:
                await _create_model(session, {**row.model_dump(by_alias=True), 'event_id': event.id}, Competition)

        users: list[Users] = await event.awaitable_attrs.users
        for user in users:
            await smtp_message.asend_email(user.email,
                                           f"Новое мероприятие по вашему любимому типу спорта!"
                                           f"Название: {event.name}, Тип спорта:{event_type.name}, Начало: {event.start_date}"
                                           )

    except SQLAlchemyError as e:
        logger.exception("Mistake in row %s", row, exc_info=e)
        await session.rollback()  # Откатываем сессию в случае ошибки
