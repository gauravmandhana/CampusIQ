from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.connection import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    student_id = Column(
        String(30),
        unique=True,
        nullable=False
    )

    roll_number = Column(
        String(30),
        unique=True,
        nullable=False
    )

    department = Column(String(100), nullable=False)

    semester = Column(Integer, nullable=False)

    section = Column(String(20))

    enrollment_year = Column(Integer)