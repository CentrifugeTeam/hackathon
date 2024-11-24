from sqlalchemy import String, ForeignKey

from .base import Base, IDMixin
from sqlalchemy.orm import mapped_column, Mapped, relationship


class UserSettings(IDMixin, Base):
    __tablename__ = 'user_settings'
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    type_event_id: Mapped[int] = mapped_column(ForeignKey('event_types.id', ondelete='CASCADE'))


class Users(IDMixin, Base):
    __tablename__ = 'users'
    email: Mapped[str] = mapped_column(String(), unique=True)
    type_events: Mapped[list['EventType']] = relationship(back_populates='users', secondary='user_settings')
