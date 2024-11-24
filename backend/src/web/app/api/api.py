from fastapi import APIRouter
from .endpoints import events, competitions, sex, location, event_types, email

api = APIRouter()
api.include_router(events.crud_events, prefix='/events', tags=['events'])
api.include_router(sex.crud_ages, prefix='/sex', tags=['sex'])
api.include_router(location.crud_locations, prefix='/locations', tags=['locations'])
api.include_router(competitions.crud_competition, prefix='/competitions', tags=['competitions'])
api.include_router(event_types.crud_event_types, prefix='/event_of_types', tags=['event_of_types'])
api.include_router(email.r, prefix='/email', tags=['email'])
