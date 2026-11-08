from app.utils.security import get_current_user
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.note import Note


router = APIRouter(
    prefix="/notes",
    tags=["Notes"],
    dependencies=[Depends(get_current_user)]
)


# =========================================================
# Get All Notes
# =========================================================

@router.get("/")
def get_notes(
    db: Session = Depends(get_db)
):
    notes = db.query(Note).all()

    return {
        "status": "success",
        "count": len(notes),
        "notes": notes
    }


# =========================================================
# Get Notes By Subject
# =========================================================

@router.get("/subject/{subject_id}")
def get_notes_by_subject(
    subject_id: int,
    db: Session = Depends(get_db)
):
    notes = db.query(Note).filter(
        Note.subject_id == subject_id
    ).all()

    return {
        "status": "success",
        "subject_id": subject_id,
        "count": len(notes),
        "notes": notes
    }