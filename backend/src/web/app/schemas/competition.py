from pydantic import BaseModel
from typing import Literal


class Competition(BaseModel):
    name: str
    type: Literal['program', 'discipline']
    event_id: int


class CompetitionRead(Competition):
    id: int


class CompetitionSearch(BaseModel):
    name: str
    type: Literal['program', 'discipline']