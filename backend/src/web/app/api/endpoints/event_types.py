from typing import Any
from fastapi import Request, Depends
from fastapi_pagination import Page
from fastapi_sqlalchemy_toolkit import ordering_depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from crud import Context
from crud.openapi_responses import not_found_response
from ...dependencies.session import get_session
from ...utils.crud import CrudAPIRouter
from storage.db.models import SportEvent, Location, AgeGroup, Competition, EventType
from ...managers import BaseManager
from ...schemas.event import EventBulkRead, LocationRead, AgeGroupRead, EventTypeSchemaRead

event_manager = BaseManager(SportEvent)
event_types_manager = BaseManager(EventType)


class CrudEventTypesAPIRouter(CrudAPIRouter):
    def _get_one(self, *args: Any, **kwargs: Any):
        super()._get_one()
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


crud_event_types = CrudEventTypesAPIRouter(Context(schema=EventTypeSchemaRead,
                                                   update_schema=EventBulkRead,
                                                   create_schema=EventBulkRead,
                                                   manager=event_types_manager, get_session=get_session,
                                                   create_route=False,
                                                   update_route=False,
                                                   delete_one_route=False,
                                                   delete_all_route=False,
                                                   ))
