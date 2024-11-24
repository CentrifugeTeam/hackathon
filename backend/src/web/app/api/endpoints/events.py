from typing import Any
from fastapi import Request, Depends
from fastapi_pagination import Page
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from crud import Context
from datetime import date
from fastapi_sqlalchemy_toolkit.ordering import ordering_depends

from crud.openapi_responses import not_found_response
from ...dependencies.session import get_session
from ...utils.crud import CrudAPIRouter
from storage.db.models import SportEvent, Location, AgeGroup, Competition, EventType
from ...managers import EventManager
from ...schemas.event import EventBulkRead, EventSearch
from logging import getLogger

logger = getLogger(__name__)

event_manager = EventManager(SportEvent, default_ordering=SportEvent.start_date.desc())

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
        async def func(
                sports: str | None = None,
                categories: str | None = None,
                competitions: str | None = None,
                cities: str | None = None,
                participant_type: str | None = None,
                participant_from: int | None = None,
                participant_to: int | None = None,
                participants_count: int | None = None,
                start_date: date | None = None,
                end_date: date | None = None,
                session: AsyncSession = Depends(self.get_session)) -> Page[schema]:
            sports = sports if sports is None else sports.split(';')
            categories = categories if categories is None else categories.split(';')
            cities = cities if cities is None else cities.split(';')
            competitions = competitions if competitions is None else competitions.split(';')

            return await self.manager.paginated_list(session,
                                                     participants_count=participants_count,
                                                     filter_expressions={
                                                         EventType.sport.in_: sports,
                                                         SportEvent.category.in_: categories,
                                                         Location.city.in_: cities,
                                                         Competition.name.in_: competitions,
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
                                                     )

    def _get_one(self):
        @self.get(
            path='/{id}',
            response_model=self.schema,
            responses={**not_found_response}

        )
        async def func(request: Request, id: int, session: AsyncSession = Depends(self.get_session)):
            return await self.manager.get_or_404(session, id=id, options=[joinedload(SportEvent.location),
                                                                          joinedload(SportEvent.age_groups),
                                                                          joinedload(SportEvent.competitions),
                                                                          joinedload(SportEvent.type_event)])


crud_events = CrudEventAPIRouter(Context(schema=EventBulkRead,
                                         update_schema=EventBulkRead,
                                         create_schema=EventBulkRead,
                                         manager=event_manager, get_session=get_session,
                                         create_route=False,
                                         update_route=False,
                                         delete_one_route=False,
                                         delete_all_route=False,
                                         ))
