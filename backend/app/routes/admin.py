from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.utils.security import require_admin
from app.database.connection import get_db


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(require_admin)]
)


# =====================================================
# ADMIN HOME
# =====================================================

@router.get("/")
def admin_home():
    return {
        "status": "success",
        "message": "Admin access granted"
    }


# =====================================================
# ADMIN STATISTICS
# =====================================================

@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db)
):
    students_count = db.execute(
        text("SELECT COUNT(*) FROM students")
    ).scalar()

    faculty_count = db.execute(
        text("SELECT COUNT(*) FROM faculty")
    ).scalar()

    subjects_count = db.execute(
        text("SELECT COUNT(*) FROM subjects")
    ).scalar()

    notices_count = db.execute(
        text("SELECT COUNT(*) FROM notices")
    ).scalar()

    users_count = db.execute(
        text("SELECT COUNT(*) FROM users")
    ).scalar()

    return {
        "status": "success",
        "students": students_count,
        "faculty": faculty_count,
        "subjects": subjects_count,
        "notices": notices_count,
        "users": users_count
    }


# =====================================================
# ADMIN - STUDENT MANAGEMENT
# =====================================================

@router.get("/students")
def get_admin_students(
    db: Session = Depends(get_db)
):
    result = db.execute(
        text("""
            SELECT
                id,
                user_id,
                student_id,
                roll_number,
                department,
                semester,
                section,
                enrollment_year
            FROM students
            ORDER BY id
        """)
    )

    return result.mappings().all()


# =====================================================
# ADMIN - FACULTY MANAGEMENT
# =====================================================

@router.get("/faculty")
def get_admin_faculty(
    db: Session = Depends(get_db)
):
    result = db.execute(
        text("""
            SELECT
                id,
                user_id,
                faculty_id,
                name,
                email,
                department,
                designation,
                phone
            FROM faculty
            ORDER BY id
        """)
    )

    return result.mappings().all()

# =====================================================
# ADMIN - SUBJECT MANAGEMENT
# =====================================================

@router.get("/subjects")
def get_admin_subjects(
    db: Session = Depends(get_db)
):
    result = db.execute(
        text("""
            SELECT
                id,
                name,
                code
            FROM subjects
            ORDER BY id
        """)
    )

    return result.mappings().all()

# =====================================================
# ADMIN - ASSIGNMENT MANAGEMENT
# =====================================================

@router.get("/assignments")
def get_admin_assignments(
    db: Session = Depends(get_db)
):
    result = db.execute(
        text("""
            SELECT
                a.id,
                a.title,
                a.description,
                a.assigned_date,
                a.due_date,
                a.max_marks,
                a.subject_id,
                s.name AS subject_name,
                a.faculty_id,
                f.name AS faculty_name
            FROM assignments a
            LEFT JOIN subjects s
                ON a.subject_id = s.id
            LEFT JOIN faculty f
                ON a.faculty_id = f.id
            ORDER BY a.id
        """)
    )

    return result.mappings().all()

@router.get("/notices")
def get_admin_notices(db: Session = Depends(get_db)):
    result = db.execute(text("""
        SELECT *
        FROM notices
        ORDER BY id DESC
    """))

    return result.mappings().all()