from crud import Context
from storage.db.models import Location
from web.app.dependencies.session import get_session
from web.app.managers import BaseManager
from web.app.schemas.event import EventBulkRead
from web.app.schemas.location import LocationRead
from web.app.utils.crud import CrudAPIRouter

location_manager = BaseManager(Location)
crud_locations = CrudAPIRouter(Context(schema=LocationRead,
                                       update_schema=EventBulkRead,
                                       create_schema=EventBulkRead,
                                       manager=location_manager, get_session=get_session,
                                       create_route=False,
                                       update_route=False,
                                       delete_one_route=False,
                                       delete_all_route=False,
                                       ))
