from crud import Context
from ...dependencies.session import get_session
from ...utils.crud import CrudAPIRouter
from storage.db.models import SportEvent
from ...managers import BaseManager
from ...schemas.calendar_plan import EventRead

files_manager = BaseManager(SportEvent)

r = CrudAPIRouter(Context(schema=EventRead,
                          update_schema=EventRead,
                          create_schema=EventRead,
                          manager=files_manager, get_session=get_session,
                          create_route=False,
                          update_route=False,
                          delete_one_route=False,
                          delete_all_route=False,
                          ))
