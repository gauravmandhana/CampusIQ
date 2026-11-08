from sqlalchemy import Column, Integer, String, Time, ForeignKey
from app.database.models import Base


class Timetable(Base):
    __tablename__ = "timetable"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    subject_id = Column(
        Integer,
        ForeignKey("subjects.id"),
        nullable=False
    )

    faculty_id = Column(
        Integer,
        ForeignKey("faculty.id"),
        nullable=True
    )

    day = Column(
        String(20),
        nullable=False
    )

    start_time = Column(
        Time,
        nullable=False
    )

    end_time = Column(
        Time,
        nullable=False
    )

    room_number = Column(
        String(50),
        nullable=True
    )