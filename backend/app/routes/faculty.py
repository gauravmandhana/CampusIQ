from app.utils.security import get_current_user, require_faculty
from app.utils.security import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.assignment import Assignment
from app.models.note import Note
from app.models.submission import Submission

from app.database.connection import get_db
from app.models.faculty import Faculty

router = APIRouter(
    prefix="/faculty",
    tags=["Faculty"],
    dependencies=[Depends(require_faculty)]
)


@router.get("/")
def get_faculty(db: Session = Depends(get_db)):
    faculty = db.query(Faculty).all()

    return {
        "status": "success",
        "count": len(faculty),
        "faculty": faculty
    }


@router.get("/{faculty_id}")
def get_faculty_by_id(
    faculty_id: int,
    db: Session = Depends(get_db)
):
    faculty = db.query(Faculty).filter(
        Faculty.id == faculty_id
    ).first()

    if not faculty:
        raise HTTPException(
            status_code=404,
            detail="Faculty not found"
        )

    return {
        "status": "success",
        "faculty": faculty
    }
@router.get("/{faculty_id}/dashboard")
def get_faculty_dashboard(
    faculty_id: int,
    db: Session = Depends(get_db)
):
    # Check faculty
    faculty = db.query(Faculty).filter(
        Faculty.id == faculty_id
    ).first()

    if not faculty:
        raise HTTPException(
            status_code=404,
            detail="Faculty not found"
        )

    # Faculty assignments
    assignments = db.query(Assignment).filter(
        Assignment.faculty_id == faculty_id
    ).all()

    # Faculty notes
    notes = db.query(Note).filter(
        Note.faculty_id == faculty_id
    ).all()

    # Get assignment IDs
    assignment_ids = [
        assignment.id
        for assignment in assignments
    ]

    # Submissions for faculty assignments
    submissions = []

    if assignment_ids:
        submissions = db.query(Submission).filter(
            Submission.assignment_id.in_(assignment_ids)
        ).all()

    return {
        "status": "success",
        "faculty": faculty,
        "summary": {
            "total_assignments": len(assignments),
            "total_notes": len(notes),
            "total_submissions": len(submissions)
        },
        "assignments": assignments,
        "notes": notes,
        "submissions": submissions
    }