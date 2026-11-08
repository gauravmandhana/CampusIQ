
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database.connection import get_db
from app.utils.security import get_current_user

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)


@router.get("/")
def get_attendance(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    role = current_user.get("role")
    user_id = current_user.get("id")

    if role == "student":
        query = text("""
            SELECT
                a.id,
                a.student_id,
                a.subject_id,
                a.date,
                a.status,
                a.percentage,
                s.name AS subject_name
            FROM attendance a
            LEFT JOIN subjects s
                ON a.subject_id = s.id
            WHERE a.student_id = :student_id
            ORDER BY a.date DESC
        """)

        params = {"student_id": user_id}

    elif role in ["faculty", "admin"]:
        query = text("""
            SELECT
                a.id,
                a.student_id,
                a.subject_id,
                a.date,
                a.status,
                a.percentage,
                s.name AS subject_name
            FROM attendance a
            LEFT JOIN subjects s
                ON a.subject_id = s.id
            ORDER BY a.date DESC
        """)

        params = {}

    else:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    result = db.execute(query, params)

    records = [
        dict(row)
        for row in result.mappings().all()
    ]

    return {
        "status": "success",
        "count": len(records),
        "attendance": records
    }


@router.get("/summary")
def get_attendance_summary(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    role = current_user.get("role")
    user_id = current_user.get("id")

    if role == "student":
        query = text("""
            SELECT
                COUNT(*) AS total_classes,
                SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END)
                    AS present,
                SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END)
                    AS absent
            FROM attendance
            WHERE student_id = :student_id
        """)

        params = {"student_id": user_id}

    elif role in ["faculty", "admin"]:
        query = text("""
            SELECT
                COUNT(*) AS total_classes,
                SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END)
                    AS present,
                SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END)
                    AS absent
            FROM attendance
        """)

        params = {}

    else:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    result = db.execute(query, params).mappings().first()

    total = result["total_classes"] or 0
    present = result["present"] or 0
    absent = result["absent"] or 0

    percentage = round(
        (present / total) * 100, 2
    ) if total else 0

    return {
        "total_classes": total,
        "present": present,
        "absent": absent,
        "attendance_percentage": percentage
    }
