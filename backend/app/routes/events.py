from app.utils.security import get_current_user
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.event import Event

router = APIRouter(
    prefix="/events",
    tags=["Events"],
    dependencies=[Depends(get_current_user)]
)


@router.get("/")
def get_events(db: Session = Depends(get_db)):
    events = db.query(Event).order_by(
        Event.event_date.asc()
    ).all()

    return {
        "status": "success",
        "count": len(events),
        "events": events
    }


@router.get("/upcoming")
def get_upcoming_events(
    db: Session = Depends(get_db)
):
    from datetime import date

    events = db.query(Event).filter(
        Event.event_date >= date.today()
    ).order_by(
        Event.event_date.asc()
    ).all()

    return {
        "status": "success",
        "count": len(events),
        "events": events
    }