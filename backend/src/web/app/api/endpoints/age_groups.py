from typing import Any
from fastapi import Request, Depends
from fastapi_pagination import Page
from fastapi_sqlalchemy_toolkit import ordering_depends
from sqlalchemy.ext.asyncio import AsyncSession
from crud import Context
from sqlalchemy import func as sql_func
from crud.openapi_responses import not_found_response
from ...dependencies.session import get_session
from ...utils.crud import CrudAPIRouter
from storage.db.models import SportEvent, AgeGroup
from ...managers import BaseManager
from ...schemas.event import EventBulkRead
from ...schemas.age_group import AgeGroupRead

manager = BaseManager(AgeGroup)
event_manager = BaseManager(SportEvent)


class CrudAgeAPIRouter(CrudAPIRouter):
    def _get_one(self, *args: Any, **kwargs: Any):
        @self.get('/search')
        async def func(name: str | None = None,
                       start: int | None = None,
                       end: int | None = None,
                       session: AsyncSession = Depends(get_session)) -> Page[AgeGroupRead]:
            return await self.manager.paginated_list(session, filter_expressions={
                AgeGroup.name.ilike: f'%{name}%' if name else None,
                AgeGroup.age_to.__ge__: start,
                AgeGroup.age_from.__le__: end,
            })

        schema = self.schema

        @self.get('/events/{id}',
                  responses={**not_found_response},
                  response_model=list[self.schema])
        async def func(id: int, session: AsyncSession = Depends(self.get_session)):
            event = await event_manager.get_or_404(session, id=id)
            return await self.manager.list(
                session,
                event_id=event.id,
            )

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
