from sqlalchemy import Column, Integer, Float, ForeignKey
from app.database.models import Base


class Marks(Base):
    __tablename__ = "marks"

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

    internal_marks = Column(
        Float,
        nullable=True
    )

    midterm_marks = Column(
        Float,
        nullable=True
    )

    practical_marks = Column(
        Float,
        nullable=True
    )

    endterm_marks = Column(
        Float,
        nullable=True
    )

    total_marks = Column(
        Float,
        nullable=True
    )