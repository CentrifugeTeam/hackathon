from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase
from typing import Generic, TypeVar

from web.app.schemas.calendar_plan import Location, Competition
from .parser_pdf.parser import Row, EventTypeSchema, AgeGroupSchema
from storage.db.models import EventType, SportEvent

DBModel = TypeVar('DBModel', bound=DeclarativeBase)


async def update_db(ctx, rows: list[Row]):
    sessionmaker = ctx['async_session_maker']
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
        stmt = stmt.where(
            getattr(model, key) == value
        )

    obj = await session.scalar(stmt)
    if obj in None:
        obj = model(**_dict)
        session.add(obj)
        await session.commit()

    return obj


async def save_event_and_related_data(session: AsyncSession, row: Row):
    try:
        # Сначала сохраняем или получаем существующее место
        location_data = row.location
        location = await session.execute(select(Location).filter_by(
            country=location_data.country,
            region=location_data.region,
            city=location_data.city
        ))
        location = location.scalars().first()

        if location is None:
            location = Location(
                country=location_data.country,
                region=location_data.region,
                city=location_data.city
            )
            session.add(location)
            await session.commit()  # Коммитим после добавления местоположения

        # Теперь создаем или находим EventType
        event_type_data = row.event_type
        event_type = await session.execute(select(EventType).filter_by(
            sport=event_type_data.sport,
            category=event_type_data.category
        ))
        event_type = event_type.scalars().first()

        if event_type is None:
            event_type = EventType(
                sport=event_type_data.sport,
                category=event_type_data.category
            )
            session.add(event_type)
            await session.commit()  # Коммитим после добавления типа события

        # Создаем событие
        event_data = row.event
        event = SportEvent(
            name=event_data.name,
            start_date=event_data.start_date,
            end_date=event_data.end_date,
            participants_count=event_data.count_people,
            type_event_id=event_type.id,
            location_id=location.id
        )
        session.add(event)
        await session.commit()  # Коммитим после добавления события

        # Сохраняем возрастные группы (AgeGroup)
        for req in row.reqs:
            age_group_data = req
            age_group = AgeGroupSchema(
                name=age_group_data.name,
                age_from=age_group_data.start,
                age_to=age_group_data.end,
                event_id=event.id
            )
            session.add(age_group)

        # Сохраняем дисциплины (Competition)
        for competition in row.competitions:
            competition_data = competition
            competition_record = Competition(
                name=competition_data.name,
                type=competition_data.type,
                event_id=event.id
            )
            session.add(competition_record)

        # Завершаем транзакцию
        await session.commit()  # Коммитим все изменения (возрастные группы и дисциплины)

    except SQLAlchemyError as e:
        # Логируем ошибку, если она возникла
        logger.exception("Ошибка при сохранении события и связанных данных", exc_info=e)
        await session.rollback()  # Откатываем сессию в случае ошибки
