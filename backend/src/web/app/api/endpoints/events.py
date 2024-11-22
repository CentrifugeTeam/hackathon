from crud import Context
from ...dependencies.session import get_session
from ...utils.crud import CrudAPIRouter
from storage.db.models import SportEvent, Location,  AgeGroup,Competition
from ...managers import BaseManager
from ...schemas.calendar_plan import EventRead, LocationRead, AgeGroupRead, CompetitionRead

manager = BaseManager(SportEvent)

crud_events = CrudAPIRouter(Context(schema=EventRead,
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
