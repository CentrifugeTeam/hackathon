from fastapi import APIRouter, Depends, Response, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ...schemas.email import UserSettings, Email
from crud.openapi_responses import bad_request_response
from ...managers import BaseManager
from ...dependencies.session import get_session
from storage.db.models import Users
from ...conf import smtp_message
from logging import getLogger

users_manager = BaseManager(Users)
logger = getLogger(__name__)
r = APIRouter()


@r.post('/register', responses={**bad_request_response}, status_code=204)
async def email(settings: UserSettings,
                session: AsyncSession = Depends(get_session)
                ):
    async with session.begin():
        email = Email(email=settings.email)
        await users_manager.create(session, email, type_events=[settings.event_types_id], commit=False)
        try:
            await smtp_message.asend_email(email.email, "Вы подписались!")
        except Exception as e:
            await session.rollback()
            logger.exception('exc in emailer ', exc_info=e)
            raise HTTPException(status_code=400)
        return Response(status_code=204)
