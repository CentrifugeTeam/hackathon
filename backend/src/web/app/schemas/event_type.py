from pydantic import BaseModel


class EventTypeSchema(BaseModel):
    sport: str
    category: str


class EventTypeSchemaRead(EventTypeSchema):
    id: int


class EventTypeSearch(EventTypeSchema):
    sport: str
