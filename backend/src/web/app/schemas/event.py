from datetime import date
from pydantic import BaseModel, ConfigDict
from .location import LocationRead
from .age_group import AgeGroupRead
from .competition import CompetitionRead
from .event_type import EventTypeSchemaRead


class EventBase(BaseModel):
    name: str
    start_date: date
    end_date: date
    participants_count: int
    category: str


class Event(EventBase):
    type_event: EventTypeSchemaRead
    location: LocationRead


class EventRead(Event):
    id: int


class EventSearch(BaseModel):
    name: str


class Age(BaseModel):
    id: int
    name: str


class EventBulk(EventBase):
    location: LocationRead
    age_groups: list[AgeGroupRead]
    competitions: list[CompetitionRead]
    type_event: EventTypeSchemaRead


class EventBulkRead(EventBulk):
    id: int
