from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, IDMixin


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
