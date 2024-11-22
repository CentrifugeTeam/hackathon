from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, IDMixin

class Location(IDMixin, Base):
	__tablename__ = 'locations'
	city: Mapped[str] = mapped_column(String())
	region: Mapped[str] = mapped_column(String(), nullable=True)
	country: Mapped[str] = mapped_column(String())
	sports: Mapped[list['SportEvent']] = relationship(back_populates='location')

