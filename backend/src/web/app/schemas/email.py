from pydantic import BaseModel


class Email(BaseModel):
    email: str

class UserSettings(Email):
    event_types_id: list[int]
