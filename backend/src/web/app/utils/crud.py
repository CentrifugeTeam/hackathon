from fastapi_pagination import Page

from crud import CRUDTemplate
from crud.openapi_responses import (
    missing_token_or_inactive_user_response, auth_responses, not_found_response, forbidden_response,
)
from fastapi_permissions import has_permission
from typing import Any, TypeVar
from fastapi import Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

Resource = TypeVar('Resource')


class CrudAPIRouter(CRUDTemplate):


    def _get_all(self, *args: Any, **kwargs: Any):

        @self.get(
            path='/',
            response_model=list[self.schema],

        )
        async def func(request: Request, session: AsyncSession = Depends(self.get_session), ):
            return await self.manager.list(session)

    def _get_one(self, *args: Any, **kwargs: Any):
        @self.get(
            path='/{id}',
            response_model=self.schema,
            responses={**not_found_response}

        )
        async def func(request: Request, id: int, session: AsyncSession = Depends(self.get_session)):
            return await self.manager.get_or_404(session, id=id)

    def _create(self, *args: Any, **kwargs: Any):
        create_schema = self.create_schema

        @self.post(
            '/',
            response_model=self.schema,
            responses={**missing_token_or_inactive_user_response, **forbidden_response}
        )
        async def func(request: Request, objs: create_schema, session: AsyncSession = Depends(self.get_session)):
            return await self.manager.create(session, objs)




