from fastapi import Depends
from fastapi_pagination import Page
from sqlalchemy.ext.asyncio import AsyncSession

from crud import Context
from storage.db.models import Location
from web.app.dependencies.session import get_session
from web.app.managers import BaseManager
from web.app.schemas.event import EventBulkRead
from web.app.schemas.location import LocationRead, LocationSearch
from web.app.utils.crud import CrudAPIRouter


class CrudEventAPIRouter(CrudAPIRouter):

    def _get_all(self):
        schema = self.schema

        @self.get('/search')
        async def func(name: str | None = None, session: AsyncSession = Depends(get_session)) -> Page[LocationSearch]:
            return await self.manager.paginated_list(session, filter_expressions={
                Location.city.ilike: f'%{name}%' if name else None
            })


location_manager = BaseManager(Location)
crud_locations = CrudEventAPIRouter(Context(schema=LocationRead,
                                            update_schema=EventBulkRead,
                                            create_schema=EventBulkRead,
                                            manager=location_manager, get_session=get_session,
                                            create_route=False,
                                            update_route=False,
                                            delete_one_route=False,
                                            delete_all_route=False,
                                            ))
