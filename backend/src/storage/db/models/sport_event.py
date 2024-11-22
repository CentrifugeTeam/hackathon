from datetime import datetime, date
from enum import unique

from sqlalchemy import ForeignKey, String, Integer, Boolean, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, IDMixin


class Location(IDMixin, Base):
    __tablename__ = 'locations'
    city: Mapped[str] = mapped_column(String())
    region: Mapped[str] = mapped_column(String(), nullable=True)
    country: Mapped[str] = mapped_column(String())
    sports: Mapped[list['SportEvent']] = relationship(back_populates='location')


class AgeGroup(IDMixin, Base):
    __tablename__ = 'age_groups'
    name: Mapped[str] = mapped_column(String(length=100), nullable=False, unique=True)
    age_from: Mapped[int] = mapped_column(Integer, nullable=False)  # Минимальный возраст
    age_to: Mapped[int] = mapped_column(Integer, nullable=False)  # Максимальный возраст
    # sports: Mapped[list['SportEvent']] = relationship(back_populates='age_group')


class EventType(IDMixin, Base):
    __tablename__ = 'event_types'
    sport: Mapped[str] = mapped_column(String(length=250), nullable=False, unique=True)
    category: Mapped[str] = mapped_column(String(length=250), nullable=False, unique=True)
    sports: Mapped[list['SportEvent']] = relationship(back_populates='type_event')


class Competition(IDMixin, Base):
    __tablename__ = 'competitions'
    type: Mapped[str] = mapped_column(String(length=80), nullable=False, unique=True)  # program or discipline
    name: Mapped[str] = mapped_column(String(length=250), nullable=False, unique=True)


class SportCompetitions(IDMixin, Base):
    __tablename__ = 'sport_competitions'
    sport_id: Mapped[int] = mapped_column(
        ForeignKey('events.id', ondelete='CASCADE'))
    competition_id: Mapped[int] = mapped_column(
        ForeignKey('competitions.id', ondelete='CASCADE'))


class SportAges(IDMixin, Base):
    __tablename__ = 'sport_ages'
    age_id: Mapped[int] = mapped_column(
        ForeignKey('age_groups.id', ondelete='CASCADE'))
    sport_id: Mapped[int] = mapped_column(
        ForeignKey('events.id', ondelete='CASCADE'))


class SportEvent(IDMixin, Base):
    __tablename__ = 'events'

    name: Mapped[str] = mapped_column(String(length=700), nullable=False, unique=True)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)  # Дата начала
    end_date: Mapped[date] = mapped_column(Date, nullable=False)  # Дата окончания
    participants_count: Mapped[int] = mapped_column(Integer, nullable=False)  # Количество участников

    type_event_id: Mapped[int] = mapped_column(
        ForeignKey('event_types.id', ondelete='CASCADE'))
    location_id: Mapped[int] = mapped_column(
        ForeignKey('locations.id', ondelete='CASCADE'))  # Связь с местом проведения
    sport_ages_id: Mapped[int] = mapped_column(
        ForeignKey('sport_ages.id', ondelete='CASCADE'))  # Связь с возрастной группой

    sport_competitions_id: Mapped[int] = mapped_column(
        ForeignKey('sport_competitions.id', ondelete='CASCADE')
    )

    type_event: Mapped[EventType] = relationship(back_populates='sports')
    location: Mapped[Location] = relationship(back_populates='sports')

    # age_group: Mapped[AgeGroup] = relationship(back_populates='sports')
