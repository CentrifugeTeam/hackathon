from sqlalchemy.ext.asyncio import AsyncSession
from .parser_pdf.parser import Row
# from storage.db.models


async def update_db(ctx, rows: list[Row]):
    sessionmaker = ctx['async_session_maker']
    async with sessionmaker() as session:
        session: AsyncSession
        for row in rows:
            _handle_row(session, row)





def _handle_row(session, row: Row):
    row.sport_event
    session.get()
    row.map