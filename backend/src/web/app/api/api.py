from fastapi import APIRouter
from .endpoints import users, auth, roles, files, events

api = APIRouter()
api.include_router(users.r, prefix='/users', tags=['users'])
api.include_router(auth.r, prefix='/auth/jwt', tags=['auth'])
api.include_router(roles.r, prefix='/roles', tags=['roles'])
api.include_router(files.r, prefix='/files', tags=['files'])
api.include_router(events.crud_events, prefix='/events', tags=['events'])
api.include_router(events.crud_ages, prefix='/ages', tags=['ages'])
api.include_router(events.crud_locations, prefix='/locations', tags=['locations'])
api.include_router(events.crud_competition, prefix='/competitions', tags=['competitions'])

