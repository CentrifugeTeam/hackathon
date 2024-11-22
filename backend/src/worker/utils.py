from sqlalchemy.ext.asyncio import AsyncSession
from .parser_pdf.parser import Row
# from storage.db.models


async def update_db(ctx, rows: list[Row]):
    sessionmaker = ctx['async_session_maker']
    async with sessionmaker() as session:
        for row in rows:
            _handle_row(session, row)
        row.sport_event
        session: AsyncSession



def _handle_row(session, row: Row):
    session.get()
    row.map