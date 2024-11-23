from typing import Any
from fastapi import Request, Depends
from fastapi_pagination import Page
from sqlalchemy.ext.asyncio import AsyncSession
from crud import Context
from ...dependencies.session import get_session
from ...utils.crud import CrudAPIRouter
from storage.db.models import SportEvent, Location, AgeGroup, Competition, EventType
from ...managers import BaseManager
from ...schemas.event import EventBulkRead
from ...schemas.event_type import EventTypeSearch, EventTypeSchemaRead

event_manager = BaseManager(SportEvent)
event_types_manager = BaseManager(EventType)


class CrudEventTypesAPIRouter(CrudAPIRouter):
    def _get_one(self, *args: Any, **kwargs: Any):
        schema = self.schema

        @self.get('/search')
        async def func(name: str | None = None,
                       session: AsyncSession = Depends(get_session)) -> Page[EventTypeSearch]:
            return await self.manager.paginated_list(session, filter_expressions={
                EventType.sport.ilike: f'%{name}%' if name else None
            })



crud_event_types = CrudEventTypesAPIRouter(Context(schema=EventTypeSchemaRead,
                                                   update_schema=EventBulkRead,
                                                   create_schema=EventBulkRead,
                                                   manager=event_types_manager, get_session=get_session,
                                                   get_all_route=False,
                                                   create_route=False,
                                                   update_route=False,
                                                   delete_one_route=False,
                                                   delete_all_route=False,
                                                   ))
