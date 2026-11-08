from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey
from app.database.models import Base


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    assignment_id = Column(
        Integer,
        ForeignKey("assignments.id"),
        nullable=False
    )

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False
    )

    submitted_at = Column(
        DateTime,
        nullable=True
    )

    file_path = Column(
        String(255),
        nullable=True
    )

    status = Column(
        String(20),
        nullable=False,
        default="submitted"
    )

    marks = Column(
        Float,
        nullable=True
    )

    feedback = Column(
        Text,
        nullable=True
    )