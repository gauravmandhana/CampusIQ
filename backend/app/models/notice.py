from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from datetime import datetime

from app.database.models import Base


class Notice(Base):
    __tablename__ = "notices"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String(200),
        nullable=False
    )

    content = Column(
        Text,
        nullable=False
    )

    posted_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    notice_type = Column(
        String(50),
        nullable=True
    )

    is_important = Column(
        Boolean,
        default=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )