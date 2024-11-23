from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase
from typing import Generic, TypeVar

from .parser_pdf.parser import Row, EventType
from storage.db.models import EventType

DBModel = TypeVar('DBModel', bound=DeclarativeBase)


async def update_db(ctx, rows: list[Row]):
    sessionmaker = ctx['async_session_maker']
    async with sessionmaker() as session:
        session: AsyncSession
        for row in rows:
            await _handle_row(session, row)


async def _handle_row(session, row: Row):
    obj = await _create_if_dont_exist(session, row.model_dump(by_alias=True), EventType)



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


