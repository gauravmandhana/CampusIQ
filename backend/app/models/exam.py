from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey
from app.database.models import Base


class Exam(Base):
    __tablename__ = "exams"

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

    exam_type = Column(
        String(50),
        nullable=False
    )

    exam_date = Column(
        Date,
        nullable=False
    )

    start_time = Column(
        Time,
        nullable=True
    )

    end_time = Column(
        Time,
        nullable=True
    )

    room_number = Column(
        String(50),
        nullable=True
    )

    max_marks = Column(
        Integer,
        nullable=True
    )