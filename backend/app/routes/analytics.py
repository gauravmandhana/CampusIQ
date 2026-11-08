from app.analytics.assignment_analysis import get_assignment_analytics
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.analytics.marks_analysis import get_marks_analytics
from app.database.connection import get_db
from app.analytics.attendance_analysis import get_attendance_analytics
from app.analytics.student_analysis import get_student_analytics


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/attendance")
def attendance_analytics(
    db: Session = Depends(get_db)
):
    analytics = get_attendance_analytics(db)

    return {
        "status": "success",
        "analytics": analytics
    }
@router.get("/marks")
def marks_analytics(db: Session = Depends(get_db)):
    return get_marks_analytics(db)
@router.get("/assignments")
def assignment_analytics(
    db: Session = Depends(get_db)
):
    return {
        "status": "success",
        "analytics": get_assignment_analytics(db)
    }
@router.get("/student")
def student_analytics(
    db: Session = Depends(get_db)
):
    return {
        "status": "success",
        "analytics": get_student_analytics(db)
    }