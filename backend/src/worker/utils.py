from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase
from typing import Generic, TypeVar

from web.app.schemas.event import Event
from web.app.schemas.event_type import EventTypeSearch
from .parser_pdf.parser import Row, EventTypeSchema
from storage.db.models import EventType, SportEvent, AgeGroup, Location, Competition
from logging import getLogger

logger = getLogger(__name__)

DBModel = TypeVar('DBModel', bound=DeclarativeBase)


async def update_db(sessionmaker, rows: list[Row]):
    async with sessionmaker() as session:
        session: AsyncSession
        for row in rows:
            await save_event_and_related_data(session, row)
            # await _handle_row(session, row)


async def _handle_row(session, row: Row):
    obj = await _create_if_dont_exist(session, row.model_dump(by_alias=True), EventTypeSchema)


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
        stmt = select(EventType).where(EventType.sport == row.event_type.sport).where(
            EventType.category == row.event_type.category)
        event_type = await session.scalar(stmt)
        if event_type is None:
            event_type = await _create_model(session, {**row.event_type.model_dump(by_alias=True)}, EventType)

        stmt = select(SportEvent).where(SportEvent.id == row.event.id)
        event = await session.scalar(stmt)
        if event is None:
            event = await _create_model(session, {**row.event.model_dump(by_alias=True), 'location_id': location.id,
                                                  'type_event_id': event_type.id}, SportEvent)

        # Сохраняем возрастные группы (AgeGroup)
        for req in row.reqs:
            await _create_if_dont_exist(session, {**req.model_dump(by_alias=True), 'event_id': event.id}, AgeGroup)

        # Сохраняем дисциплины (Competition)
        for competition in row.competitions:
            await _create_if_dont_exist(session, {**competition.model_dump(by_alias=True), 'event_id': event.id},
                                        Competition)

    except SQLAlchemyError as e:
        await session.rollback()  # Откатываем сессию в случае ошибки
