from pydantic import BaseModel, ConfigDict


class AgeGroup(BaseModel):
    name: str
    start: int | None = None
    end: int | None = None


class AgeGroupRead(AgeGroup):
    id: int




class AgeGroupSearch(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    name: str