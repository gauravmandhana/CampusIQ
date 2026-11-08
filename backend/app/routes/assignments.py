from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.utils.security import get_current_user


router = APIRouter(
    prefix="/assignments",
    tags=["Assignments"]
)


@router.get("/")
def get_assignments(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    query = text("""
        SELECT *
        FROM assignments
        ORDER BY id
    """)

    result = db.execute(query)

    assignments = [
        dict(row)
        for row in result.mappings().all()
    ]

    return assignments