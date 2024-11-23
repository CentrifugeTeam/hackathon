from datetime import date

from typing import Literal
from pydantic import BaseModel


class AgeGroup(BaseModel):
    name: str
    start: int | None = None
    end: int | None = None


class AgeGroupRead(AgeGroup):
    id: int


class SportEventType(BaseModel):
    sport: str
    category: str


class SportEventTypeRead(SportEventType):
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
    type_event_id: int
    location_id: int
    age_group_id: int


class EventRead(Event):
    id: int


class CalendarRequest(BaseModel):

    sports: list[str] | None = None
    categories: list[str] | None = None
    cities: list[str] | None = None
    regions: list[str] | None = None
    age_names: list[str]
    age_groups: list[str] | None = None
