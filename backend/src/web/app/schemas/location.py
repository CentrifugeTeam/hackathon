from pydantic import BaseModel


class Location(BaseModel):
    country: str
    region: str | None
    city: str


class LocationRead(Location):
    id: int


class LocationSearch(BaseModel):
    city: str
