from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.models import Base


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(
        String(100),
        nullable=False
    )

    code = Column(
        String(20),
        unique=True,
        nullable=False
    )

    department_id = Column(
        Integer,
        ForeignKey("departments.id"),
        nullable=False
    )

    semester = Column(
        Integer,
        nullable=False
    )

    credits = Column(
        Integer,
        nullable=True
    )