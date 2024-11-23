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

manager = BaseManager(SportEvent)

children_ordering_fields = {
    "start_date": SportEvent.start_date,
    "end_date": SportEvent.end_date,
}


class CrudEventAPIRouter(CrudAPIRouter):

    def _get_all(self, *args: Any, **kwargs: Any):
        schema = self.schema

        @self.get(path='/')
        async def func(request: Request,
                       calendar: CalendarRequest,
                       order_by=ordering_depends(children_ordering_fields),
                       session: AsyncSession = Depends(self.get_session)) -> Page[schema]:
            return await self.manager.paginated_list(session,
                                                     filter_expressions={
                                                         EventType.sport.in_: calendar.sports,
                                                         EventType.category.in_: calendar.categories,
                                                         Location.city.in_: calendar.cities,
                                                         Location.region.in_: calendar.regions,
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
### TODO сделать для дисциплин и программ взятие через event_id
manager = BaseManager(Competition)
crud_competition = CrudAPIRouter(Context(schema=CompetitionRead,
                                         update_schema=EventRead,
                                         create_schema=EventRead,
                                         manager=manager, get_session=get_session,
                                         create_route=False,
                                         update_route=False,
                                         delete_one_route=False,
                                         delete_all_route=False,
                                         ))
####

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

manager = BaseManager(AgeGroup)
crud_ages = CrudAPIRouter(Context(schema=AgeGroupRead,
                                  update_schema=EventRead,
                                  create_schema=EventRead,
                                  manager=manager, get_session=get_session,
                                  create_route=False,
                                  update_route=False,
                                  delete_one_route=False,
                                  delete_all_route=False,
                                  ))
