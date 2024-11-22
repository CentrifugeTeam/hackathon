from datetime import datetime

from sqlalchemy import ForeignKey, String, Integer, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, IDMixin
from location import Location


class AgeGroup(IDMixin, Base):
    __tablename__ = 'age_groups'
    men: Mapped[bool] = mapped_column(Boolean, nullable=False)  # Пол (True - мужчины, False - женщины)
    age_from: Mapped[int] = mapped_column(Integer, nullable=False)  # Минимальный возраст
    age_to: Mapped[int] = mapped_column(Integer, nullable=False)  # Максимальный возраст


class NameSportEvent(IDMixin, Base):
    __tablename__ = 'name_sport_events'
    name: Mapped[str] = mapped_column(String(length=250), nullable=False)


class Discipline(IDMixin, Base):
    __tablename__ = 'disciplines'

    name: Mapped[str] = mapped_column(String(length=250), nullable=False)


class Program(IDMixin, Base):
    __tablename__ = 'programs'

    name: Mapped[str] = mapped_column(String(length=250), nullable=False)


class SportEvent(IDMixin, Base):
    __tablename__ = 'sport_events'

    start_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)  # Дата начала
    end_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)  # Дата окончания

    name_event_id: Mapped[int] = mapped_column(
        ForeignKey('name_sport_events.id', ondelete='CASCADE'))  # Связь с наименованием мероприятия
    location_id: Mapped[int] = mapped_column(
        ForeignKey('locations.id', ondelete='CASCADE'))  # Связь с местом проведения
    age_group_id: Mapped[int] = mapped_column(
        ForeignKey('age_groups.id', ondelete='CASCADE'))  # Связь с возрастной группой
    discipline_id: Mapped[int] = mapped_column(ForeignKey('disciplines.id', ondelete='CASCADE'))  # Связь с дисциплиной
    program_id: Mapped[int] = mapped_column(ForeignKey('programs.id', ondelete='CASCADE'))  # Связь с программой
    participants_count: Mapped[int] = mapped_column(Integer, nullable=False)  # Количество участников
    additional_info: Mapped[str] = mapped_column(String(length=1000))  # Дополнительная информация

    # name_event: Mapped[NameSportEvent] = relationship('NameSportEvent')
    # location: Mapped[Location] = relationship('Location')
    # age_group: Mapped[AgeGroup] = relationship('AgeGroup')
    # discipline: Mapped[Discipline] = relationship('Discipline')
    # program: Mapped[Program] = relationship('Program', back_populates='')
#
