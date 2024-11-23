from datetime import date

from typing import Literal
from pydantic import BaseModel



class AgeGroup(BaseModel):
    name: str
    start: int | None = None
    end: int | None = None


class AgeGroupRead(AgeGroup):
    id: int


class EventTypeSchema(BaseModel):
    sport: str
    category: str


class EventTypeSchemaRead(EventTypeSchema):
    id: int


class Competition(BaseModel):
    name: str
    type: Literal['program', 'discipline']
    event_id: int


class CompetitionRead(Competition):
    id: int


class Location(BaseModel):
    country: str
    region: str | None
    city: str


class LocationRead(Location):
    id: int


class EventBase(BaseModel):
    name: str
    start_date: date
    end_date: date
    participants_count: int


class Event(EventBase):
    location: LocationRead
    age_groups: list[AgeGroupRead]
    competitions: list[CompetitionRead]
    type_event: EventTypeSchemaRead


class EventRead(Event):
    id: int


