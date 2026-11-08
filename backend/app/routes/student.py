from app.utils.security import get_current_user, require_student
from app.utils.security import get_current_user
from app.utils.security import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.student import Student
from app.models.attendance import Attendance
from app.models.marks import Marks
from app.models.assignment import Assignment
from app.models.submission import Submission
from app.models.exam import Exam

router = APIRouter(
    prefix="/students",
    tags=["Students"],
    dependencies=[Depends(require_student)]
)


@router.get("/")
def get_students(db: Session = Depends(get_db)):
    students = db.query(Student).all()

    return {
        "status": "success",
        "count": len(students),
        "students": students
    }


@router.get("/{student_id}")
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return {
        "status": "success",
        "student": student
    }


@router.get("/{student_id}/dashboard")
def get_student_dashboard(
    student_id: int,
    db: Session = Depends(get_db)
):
    # Student
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    # Attendance
    attendance = db.query(Attendance).filter(
        Attendance.student_id == student_id
    ).all()

    # Marks
    marks = db.query(Marks).filter(
        Marks.student_id == student_id
    ).all()

    # Assignments
    assignments = db.query(Assignment).all()

    # Submissions
    submissions = db.query(Submission).filter(
        Submission.student_id == student_id
    ).all()

    # Exams
    exams = db.query(Exam).all()

    return {
        "status": "success",
        "student": student,
        "attendance": attendance,
        "marks": marks,
        "assignments": assignments,
        "submissions": submissions,
        "exams": exams
    }

@router.get("/{student_id}/attendance-summary")
def get_attendance_summary(
    student_id: int,
    db: Session = Depends(get_db)
):
    # Check student
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    # Get attendance records
    attendance_records = db.query(Attendance).filter(
        Attendance.student_id == student_id
    ).all()

    total_classes = len(attendance_records)

    present = sum(
        1 for record in attendance_records
        if record.status == 1
    )

    absent = total_classes - present

    if total_classes > 0:
        percentage = round(
            (present / total_classes) * 100,
            2
        )
    else:
        percentage = 0

    return {
        "status": "success",
        "student_id": student.student_id,
        "roll_number": student.roll_number,
        "total_classes": total_classes,
        "present": present,
        "absent": absent,
        "attendance_percentage": percentage
    }

@router.get("/{student_id}/marks-summary")
def get_marks_summary(
    student_id: int,
    db: Session = Depends(get_db)
):
    # Check student
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    # Get marks records
    marks_records = db.query(Marks).filter(
        Marks.student_id == student_id
    ).all()

    if not marks_records:
        return {
            "status": "success",
            "student_id": student.student_id,
            "roll_number": student.roll_number,
            "total_subjects": 0,
            "total_marks": 0,
            "average_marks": 0,
            "highest_marks": 0,
            "lowest_marks": 0
        }

    # Extract total marks
    total_marks_list = [
        record.total_marks
        for record in marks_records
        if record.total_marks is not None
    ]

    total_subjects = len(total_marks_list)
    total_marks = sum(total_marks_list)

    average_marks = round(
        total_marks / total_subjects,
        2
    )

    highest_marks = max(total_marks_list)
    lowest_marks = min(total_marks_list)

    return {
        "status": "success",
        "student_id": student.student_id,
        "roll_number": student.roll_number,
        "total_subjects": total_subjects,
        "total_marks": total_marks,
        "average_marks": average_marks,
        "highest_marks": highest_marks,
        "lowest_marks": lowest_marks
    }
@router.get("/{student_id}/assignment-summary")
def get_assignment_summary(
    student_id: int,
    db: Session = Depends(get_db)
):
    # Check student
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    # Get all assignments
    assignments = db.query(Assignment).all()

    # Get student's submissions
    submissions = db.query(Submission).filter(
        Submission.student_id == student_id
    ).all()

    total_assignments = len(assignments)
    submitted = len(submissions)

    pending = max(
        total_assignments - submitted,
        0
    )

    if total_assignments > 0:
        submission_rate = round(
            (submitted / total_assignments) * 100,
            2
        )
    else:
        submission_rate = 0

    return {
        "status": "success",
        "student_id": student.student_id,
        "roll_number": student.roll_number,
        "total_assignments": total_assignments,
        "submitted": submitted,
        "pending": pending,
        "submission_rate": submission_rate
    }
@router.get("/{student_id}/exams")
def get_student_exams(
    student_id: int,
    db: Session = Depends(get_db)
):
    # Check student
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    # Get exams
    exams = db.query(Exam).all()

    exam_list = []

    for exam in exams:
        exam_list.append({
            "id": exam.id,
            "subject_id": exam.subject_id,
            "exam_type": exam.exam_type,
            "exam_date": exam.exam_date,
            "start_time": exam.start_time,
            "end_time": exam.end_time,
            "room_number": exam.room_number,
            "max_marks": exam.max_marks
        })

    return {
        "status": "success",
        "student_id": student.student_id,
        "roll_number": student.roll_number,
        "total_exams": len(exam_list),
        "exams": exam_list
    }