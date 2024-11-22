from sqlalchemy import ForeignKey, String, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, IDMixin, DateTime
from location import Location


class Country(IDMixin, Base):
	__tablename__ = 'countries'

	name: Mapped[str] = mapped_column(String(length=100), unique=True, nullable=False)
	code: Mapped[str] = mapped_column(String(length=3), nullable=False)

	regions: Mapped[list['Region']] = relationship('Region', back_populates='country', cascade='all, delete')


class Region(IDMixin, Base):
	__tablename__ = 'regions'

	name: Mapped[str] = mapped_column(String(length=100), nullable=False)
	country_id: Mapped[int] = mapped_column(ForeignKey('countries.id', ondelete='CASCADE'))

	country: Mapped[Country] = relationship('Country', back_populates='regions')
	cities: Mapped[list['City']] = relationship('City', back_populates='region', cascade='all, delete')


class City(IDMixin, Base):
	__tablename__ = 'cities'

	name: Mapped[str] = mapped_column(String(length=100), nullable=False)
	region_id: Mapped[int] = mapped_column(ForeignKey('regions.id', ondelete='CASCADE'))

	region: Mapped[Region] = relationship('Region', back_populates='cities')


class Location(IDMixin, Base):
	__tablename__ = 'locations'

	city_id: Mapped[int] = mapped_column(ForeignKey('cities.id', ondelete='CASCADE'))
	region_id: Mapped[int] = mapped_column(ForeignKey('regions.id', ondelete='CASCADE'))
	country_id: Mapped[int] = mapped_column(ForeignKey('countries.id', ondelete='CASCADE'))


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


class EventDate(IDMixin, Base):
	__tablename__ = 'event_dates'

	start_date: Mapped[DateTime] = mapped_column(nullable=False)  # Дата начала
	end_date: Mapped[DateTime] = mapped_column(nullable=False)    # Дата окончания


class SportEvent(IDMixin, Base):
    __tablename__ = 'sport_events'

    no_sm_ekp: Mapped[int] = mapped_column(Integer, nullable=False)  # Поле: No СМ в ЕКП
    name_event_id: Mapped[int] = mapped_column(ForeignKey('name_sport_events.id', ondelete='CASCADE'))  # Связь с наименованием мероприятия
    event_date_id: Mapped[int] = mapped_column(ForeignKey('event_dates.id', ondelete='CASCADE'))  # Связь со сроками проведения
    location_id: Mapped[int] = mapped_column(ForeignKey('locations.id', ondelete='CASCADE'))  # Связь с местом проведения
    age_group_id: Mapped[int] = mapped_column(ForeignKey('age_groups.id', ondelete='CASCADE'))  # Связь с возрастной группой
    discipline_id: Mapped[int] = mapped_column(ForeignKey('disciplines.id', ondelete='CASCADE'))  # Связь с дисциплиной
    program_id: Mapped[int] = mapped_column(ForeignKey('programs.id', ondelete='CASCADE'))  # Связь с программой
    participants_count: Mapped[int] = mapped_column(Integer, nullable=False)  # Количество участников
    additional_info: Mapped[str] = mapped_column(String(length=1000))  # Дополнительная информация

    name_event: Mapped[NameSportEvent] = relationship('NameSportEvent')
    event_date: Mapped[EventDate] = relationship('EventDate')
    location: Mapped[Location] = relationship('Location')
    age_group: Mapped[AgeGroup] = relationship('AgeGroup')
    discipline: Mapped[Discipline] = relationship('Discipline')
    program: Mapped[Program] = relationship('Program')
