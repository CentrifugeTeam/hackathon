from fastapi import APIRouter, Depends, Response, HTTPException
from ...schemas.email import UserSettings, Email
from crud.openapi_responses import bad_request_response
from ...managers import BaseManager
from ...dependencies.session import get_session
from storage.db.models import Users
from ...conf import smtp_message

users_manager = BaseManager(Users)

r = APIRouter()


@r.post('/register', responses={**bad_request_response})
async def email(settings: UserSettings,
                session=Depends(get_session)
                ):
    email = Email(email=settings.email)
    await users_manager.create(session, email, events=[settings.event_types_id])
    try:
        await smtp_message.asend_email(email.email, "Hello!")
    except:
        raise HTTPException(status_code=400)
    return Response(status_code=204)
