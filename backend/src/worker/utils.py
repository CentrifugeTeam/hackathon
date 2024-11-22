from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from .parser_pdf.parser import Row, SportEvent
from storage.db.models import EventType


async def update_db(ctx, rows: list[Row]):
    sessionmaker = ctx['async_session_maker']
    async with sessionmaker() as session:
        session: AsyncSession
        for row in rows:
            await _handle_row(session, row)


async def _handle_row(session, row: Row):
    await _handle_name_sport_event(row, session)


async def _handle_name_sport_event(row: Row, session: AsyncSession):
    stmt = select(EventType).where((EventType.category == row.category) &
                                   (EventType.sport == row.sport))
    obj = await session.scalar(stmt)
    if obj in None:
        obj = EventType(category=row.category, sport=row.sport)
        session.add(obj)
        await session.commit()

    return obj

