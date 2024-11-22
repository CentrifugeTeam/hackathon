from datetime import datetime
from .base import Base, IDMixin
from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy import ForeignKey, DateTime


class FilePDF(IDMixin, Base):
    __tablename__ = 'pdf_files'
    file_id: Mapped[int] = mapped_column(ForeignKey('files.id'))
    touch_date: Mapped[datetime] = mapped_column(DateTime)
