
from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.models import Base


class Faculty(Base):
    __tablename__ = "faculty"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    faculty_id = Column(
        String(30),
        unique=True,
        nullable=False
    )

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(100),
        unique=True,
        nullable=False
    )

    department = Column(
        String(100),
        nullable=False
    )

    designation = Column(
        String(100),
        nullable=True
    )

    phone = Column(
        String(15),
        nullable=True
    )
