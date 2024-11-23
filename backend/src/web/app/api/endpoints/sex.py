from typing import Any
from fastapi import Request, Depends
from fastapi_pagination import Page
from fastapi_sqlalchemy_toolkit import ordering_depends
from sqlalchemy.ext.asyncio import AsyncSession
from crud import Context
from sqlalchemy import func as sql_func, select

from crud.openapi_responses import not_found_response
from ...dependencies.session import get_session
from ...utils.crud import CrudAPIRouter
from storage.db.models import SportEvent, AgeGroup
from ...managers import BaseManager
from ...schemas.event import EventBulkRead
from ...schemas.age_group import AgeGroupRead, AgeGroupSearch

manager = BaseManager(AgeGroup)


class CrudAgeAPIRouter(CrudAPIRouter):
    def _get_one(self, *args: Any, **kwargs: Any):
        @self.get('/search', response_model=list[AgeGroupSearch])
        async def func(name: str | None = None,
                       session: AsyncSession = Depends(get_session)):
            stmt = select(AgeGroup)
            if name:
                stmt = stmt.where(AgeGroup.name.ilike(f'%{name}%'))
            return (await session.scalars(stmt.distinct(AgeGroup.name)))

        super()._get_one()


crud_ages = CrudAgeAPIRouter(Context(schema=AgeGroupRead,
                                     update_schema=EventBulkRead,
                                     create_schema=EventBulkRead,
                                     manager=manager, get_session=get_session,
                                     create_route=False,
                                     update_route=False,
                                     delete_one_route=False,
                                     delete_all_route=False,
                                     ))
