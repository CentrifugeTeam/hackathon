from datetime import datetime, date
from sqlalchemy import ForeignKey, String, Integer, Boolean, Date, BigInteger, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, IDMixin


class Location(IDMixin, Base):
    __tablename__ = 'locations'
    city: Mapped[str] = mapped_column(String())
    region: Mapped[str] = mapped_column(String(), nullable=True)
    country: Mapped[str] = mapped_column(String())
    sports: Mapped[list['SportEvent']] = relationship(back_populates='location', cascade='delete')


class AgeGroup(IDMixin, Base):
    __tablename__ = 'age_groups'
    name: Mapped[str] = mapped_column(String(length=100), nullable=False)
    age_from: Mapped[int] = mapped_column(Integer, nullable=True)  # Минимальный возраст
    age_to: Mapped[int] = mapped_column(Integer, nullable=True)  # Максимальный возраст
    event_id: Mapped[int] = mapped_column(ForeignKey('events.id', ondelete='CASCADE'))
    sport: Mapped['SportEvent'] = relationship(back_populates='age_groups', cascade='delete')


class EventType(IDMixin, Base):
    __tablename__ = 'event_types'
    sport: Mapped[str] = mapped_column(String(length=250), nullable=False, unique=True)
    sports: Mapped[list['SportEvent']] = relationship(back_populates='type_event', cascade='delete')
    users: Mapped[list['Users']] = relationship(back_populates='type_events', secondary='user_settings')


class Competition(IDMixin, Base):
    __tablename__ = 'competitions'
    type: Mapped[str] = mapped_column(String(length=80), nullable=False)  # program or discipline
    name: Mapped[str] = mapped_column(String(length=250), nullable=False)
    event_id: Mapped[int] = mapped_column(ForeignKey('events.id', ondelete='CASCADE'))
    sport: Mapped['SportEvent'] = relationship(back_populates='competitions', cascade='delete')
    __table_args__ = (UniqueConstraint('type', 'name', name='unique_type_and_name'),)


class SportEvent(Base):
    __tablename__ = 'events'
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    category: Mapped[str] = mapped_column(String(length=250), nullable=False)

    name: Mapped[str] = mapped_column(String(length=700), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)  # Дата начала
    end_date: Mapped[date] = mapped_column(Date, nullable=False)  # Дата окончания
    participants_count: Mapped[int] = mapped_column(Integer, nullable=False)  # Количество участников

    type_event_id: Mapped[int] = mapped_column(ForeignKey('event_types.id', ondelete='CASCADE'))
    location_id: Mapped[int] = mapped_column(
        ForeignKey('locations.id', ondelete='CASCADE'))  # Связь с местом проведения

    type_event: Mapped[EventType] = relationship(back_populates='sports', cascade='delete')
    location: Mapped[Location] = relationship(back_populates='sports', cascade='delete')
    age_groups: Mapped[list[AgeGroup]] = relationship(back_populates='sport', cascade='delete')
    competitions: Mapped[list[Competition]] = relationship(back_populates='sport', cascade='delete')

# TODO: воркер работает не корректно с age
