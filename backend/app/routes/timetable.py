from app.utils.security import get_current_user
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.timetable import Timetable

router = APIRouter(
    prefix="/timetable",
    tags=["Timetable"],
    dependencies=[Depends(get_current_user)]
)


@router.get("/")
def get_timetable(db: Session = Depends(get_db)):
    timetable = db.query(Timetable).order_by(
        Timetable.day.asc(),
        Timetable.start_time.asc()
    ).all()

    return {
        "status": "success",
        "count": len(timetable),
        "timetable": timetable
    }


@router.get("/day/{day}")
def get_timetable_by_day(
    day: str,
    db: Session = Depends(get_db)
):
    timetable = db.query(Timetable).filter(
        Timetable.day == day
    ).order_by(
        Timetable.start_time.asc()
    ).all()

    return {
        "status": "success",
        "day": day,
        "count": len(timetable),
        "timetable": timetable
    }