from datetime import date

from pydantic import BaseModel


class AgeGroup(BaseModel):
    event_id: int
    name: str
    start: int | None = None
    end: int | None = None


class AgeGroupRead(AgeGroup):
    id: int


class Location(BaseModel):
    country: str
    region: str | None
    city: str

class LocationRead(Location):
    id: int

class Event(BaseModel):
    name: str
    start_date: date
    end_date: date
    location: LocationRead
    participants_count: int

class EventRead(Event):
    id: int


