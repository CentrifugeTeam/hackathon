from typing import Any
from fastapi import Request, Depends
from fastapi_pagination import Page
from fastapi_sqlalchemy_toolkit import ordering_depends
from sqlalchemy.ext.asyncio import AsyncSession
from crud import Context
from ...dependencies.session import get_session
from ...utils.crud import CrudAPIRouter
from storage.db.models import SportEvent, Location, AgeGroup, Competition, EventType
from ...managers import BaseManager
from ...schemas.calendar_plan import EventRead, LocationRead, AgeGroupRead, CompetitionRead, CalendarRequest
from logging import getLogger

logger = getLogger(__name__)

manager = BaseManager(SportEvent)

children_ordering_fields = {
    "start_date": SportEvent.start_date,
    "end_date": SportEvent.end_date,
}


class CrudEventAPIRouter(CrudAPIRouter):

    def _get_all(self, *args: Any, **kwargs: Any):
        schema = self.schema

        @self.get('/')
        async def func(request: Request,
                       order_by=ordering_depends(children_ordering_fields),
                       sports: str | None = None,
                       categories: str | None = None,
                       cities: str | None = None,
                       regions: str | None = None,
                       age_names: str | None = None,
                       age_groups: str | None = None,
                       session: AsyncSession = Depends(self.get_session)) -> Page[schema]:
            sports = sports if sports is None else sports.split(';')
            categories = categories if categories is None else categories.split(';')
            cities = cities if cities is None else cities.split(';')
            regions = regions if regions is None else regions.split(';')
            age_names = age_names if age_names is None else age_names.split(';')
            age_groups = age_groups if age_groups is None else age_groups.split(';')

            logger.info('order by %s', order_by)
            return await self.manager.paginated_list(session,
                                                     filter_expressions={
                                                         EventType.sport.in_: sports,
                                                         EventType.category.in_: categories,
                                                         Location.city.in_: cities,
                                                         Location.region.in_: regions,
                                                         # AgeGroup.
                                                     },
                                                     order_by=order_by,
                                                     )


crud_events = CrudEventAPIRouter(Context(schema=EventRead,
                                         update_schema=EventRead,
                                         create_schema=EventRead,
                                         manager=manager, get_session=get_session,
                                         create_route=False,
                                         update_route=False,
                                         delete_one_route=False,
                                         delete_all_route=False,
                                         ))

manager = BaseManager(Location)
crud_locations = CrudAPIRouter(Context(schema=LocationRead,
                                       update_schema=EventRead,
                                       create_schema=EventRead,
                                       manager=manager, get_session=get_session,
                                       create_route=False,
                                       update_route=False,
                                       delete_one_route=False,
                                       delete_all_route=False,
                                       ))
