from pydantic import BaseModel


class AgeGroup(BaseModel):
    event_id: int
    name: str
    start: int | None = None
    end: int | None = None


class AgeGroupRead(AgeGroup):
    id: int
