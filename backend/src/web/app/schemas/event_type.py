from pydantic import BaseModel


class EventTypeSchema(BaseModel):
    sport: str


class EventTypeSchemaRead(EventTypeSchema):
    id: int


class EventTypeSearch(BaseModel):
    id: int
    sport: str
