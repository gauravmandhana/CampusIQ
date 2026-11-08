from sqlalchemy import Column, Integer, Float, Date, ForeignKey
from app.database.models import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False
    )

    subject_id = Column(
        Integer,
        ForeignKey("subjects.id"),
        nullable=False
    )

    date = Column(
        Date,
        nullable=False
    )

    status = Column(
        Integer,
        nullable=False
    )

    percentage = Column(
        Float,
        nullable=True
    )