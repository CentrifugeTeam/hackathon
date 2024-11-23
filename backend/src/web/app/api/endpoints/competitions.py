from typing import Any, Literal
from fastapi import Request, Depends
from fastapi_pagination import Page
from fastapi_sqlalchemy_toolkit import ordering_depends
from sqlalchemy.ext.asyncio import AsyncSession
from crud import Context
from crud.openapi_responses import not_found_response
from ...dependencies.session import get_session
from ...schemas.competition import CompetitionSearch
from ...utils.crud import CrudAPIRouter
from storage.db.models import SportEvent, Competition, EventType
from ...managers import BaseManager
from ...schemas.event import EventBulkRead, CompetitionRead

competition_manager = BaseManager(Competition)
event_manager = BaseManager(SportEvent)


class CrudCompetitionAPIRouter(CrudAPIRouter):
    def _get_one(self, *args: Any, **kwargs: Any):
        schema = self.schema

        @self.get('/search')
        async def func(type: Literal['program', 'discipline'], name: str | None = None,
                       session: AsyncSession = Depends(get_session)) -> Page[CompetitionSearch]:
            return await self.manager.paginated_list(session, type=type, filter_expressions={
                Competition.name.ilike: f'%{name}%' if name else None
            })

        @self.get('/events/{id}',
                  responses={**not_found_response},
                  response_model=list[self.schema])
        async def func(id: int, session: AsyncSession = Depends(self.get_session)):
            event = await event_manager.get_or_404(session, id=id)
            return await self.manager.list(
                session,
                event_id=event.id,
            )

        super()._get_one()


crud_competition = CrudCompetitionAPIRouter(Context(schema=CompetitionRead,
                                                    update_schema=EventBulkRead,
                                                    create_schema=EventBulkRead,
                                                    manager=competition_manager, get_session=get_session,
                                                    create_route=False,
                                                    update_route=False,
                                                    delete_one_route=False,
                                                    delete_all_route=False,
                                                    ))
