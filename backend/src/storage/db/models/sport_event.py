from datetime import datetime, date
from enum import unique

from sqlalchemy import ForeignKey, String, Integer, Boolean, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, IDMixin
from location import Location


class AgeGroup(IDMixin, Base):
    __tablename__ = 'age_groups'
    name: Mapped[str] = mapped_column(String(length=100), nullable=False, unique=True)
    age_from: Mapped[int] = mapped_column(Integer, nullable=False)  # Минимальный возраст
    age_to: Mapped[int] = mapped_column(Integer, nullable=False)  # Максимальный возраст
    sports: Mapped[list['SportEvent']] = relationship(back_populates='age_group')


class NameSportEvent(IDMixin, Base):
    __tablename__ = 'name_sport_events'
    name: Mapped[str] = mapped_column(String(length=250), nullable=False, unique=True)
    sports: Mapped[list['SportEvent']] = relationship(back_populates='name_event')


class Discipline(IDMixin, Base):
    __tablename__ = 'disciplines'
    name: Mapped[str] = mapped_column(String(length=250), nullable=False, unique=True)
    event_id: Mapped[int] = mapped_column(ForeignKey('events.id', ondelete='CASCADE'))
    sports: Mapped[list['SportEvent']] = relationship(back_populates='disciplines')


class Program(IDMixin, Base):
    __tablename__ = 'programs'
    name: Mapped[str] = mapped_column(String(length=250), nullable=False, unique=True)
    event_id: Mapped[int] = mapped_column(ForeignKey('events.id', ondelete='CASCADE'))
    sports: Mapped[list['SportEvent']] = relationship(back_populates='programs')


class SportEvent(IDMixin, Base):
    __tablename__ = 'events'

    start_date: Mapped[date] = mapped_column(Date, nullable=False)  # Дата начала
    end_date: Mapped[date] = mapped_column(Date, nullable=False)  # Дата окончания

    name_event_id: Mapped[int] = mapped_column(
        ForeignKey('name_sport_events.id', ondelete='CASCADE'))  # Связь с наименованием мероприятия
    location_id: Mapped[int] = mapped_column(
        ForeignKey('locations.id', ondelete='CASCADE'))  # Связь с местом проведения
    age_group_id: Mapped[int] = mapped_column(
        ForeignKey('age_groups.id', ondelete='CASCADE'))  # Связь с возрастной группой

    participants_count: Mapped[int] = mapped_column(Integer, nullable=False)  # Количество участников

    name_event: Mapped[NameSportEvent] = relationship(back_populates='sports')
    location: Mapped[Location] = relationship(back_populates='sports')

    age_group: Mapped[AgeGroup] = relationship(back_populates='sports')
    disciplines: Mapped[list[Discipline]] = relationship(back_populates='sport')
    programs: Mapped[list[Program]] = relationship(back_populates='sport')
