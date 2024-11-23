from typing import Any
from fastapi import Request, Depends
from fastapi_pagination import Page

from fastapi_sqlalchemy_toolkit import ordering_depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from crud import Context
from datetime import date
from ...dependencies.session import get_session
from ...utils.crud import CrudAPIRouter
from storage.db.models import SportEvent, Location, AgeGroup, Competition, EventType
from ...managers import BaseManager
from ...schemas.event import EventBulkRead, EventSearch
from logging import getLogger

logger = getLogger(__name__)

event_manager = BaseManager(SportEvent)

children_ordering_fields = {
    "start_date": SportEvent.start_date,
    "end_date": SportEvent.end_date,
}


class CrudEventAPIRouter(CrudAPIRouter):

    def _get_all(self, *args: Any, **kwargs: Any):
        schema = self.schema

        @self.get('/search')
        async def func(name: str | None = None, session: AsyncSession = Depends(get_session)) -> Page[EventSearch]:
            return await self.manager.paginated_list(session, filter_expressions={
                SportEvent.name.ilike: f'%{name}%' if name else None
            })

        @self.get('/')
        async def func(  # order_by=ordering_depends(children_ordering_fields),
                sports: str | None = None,
                categories: str | None = None,
                cities: str | None = None,
                regions: str | None = None,
                participant_type: str | None = None,
                participant_from: int | None = None,
                participant_to: int | None = None,
                start_date: date | None = None,
                end_date: date | None = None,
                session: AsyncSession = Depends(self.get_session)) -> Page[schema]:
            sports = sports if sports is None else sports.split(';')
            categories = categories if categories is None else categories.split(';')
            cities = cities if cities is None else cities.split(';')
            regions = regions if regions is None else regions.split(';')

            return await self.manager.paginated_list(session,
                                                     filter_expressions={
                                                         EventType.sport.in_: sports,
                                                         Location.city.in_: cities,
                                                         Location.region.in_: regions,
                                                         AgeGroup.name.ilike: participant_type,
                                                         AgeGroup.age_to.__le__: participant_to,
                                                         AgeGroup.age_from.__ge__: participant_from,
                                                         SportEvent.start_date.__ge__: start_date,
                                                         SportEvent.end_date.__le__: end_date,
                                                     },
                                                     options=[joinedload(SportEvent.location),
                                                              joinedload(SportEvent.age_groups),
                                                              joinedload(SportEvent.competitions),
                                                              joinedload(SportEvent.type_event)]
                                                     # order_by=order_by,
                                                     )


crud_events = CrudEventAPIRouter(Context(schema=EventBulkRead,
                                         update_schema=EventBulkRead,
                                         create_schema=EventBulkRead,
                                         manager=event_manager, get_session=get_session,
                                         create_route=False,
                                         update_route=False,
                                         delete_one_route=False,
                                         delete_all_route=False,
                                         ))
