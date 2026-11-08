from sqlalchemy.orm import Session

from app.analytics.attendance_analysis import get_attendance_analytics
from app.analytics.marks_analysis import get_marks_analytics
from app.analytics.assignment_analysis import get_assignment_analytics


def get_student_analytics(db: Session):

    attendance = get_attendance_analytics(db)

    marks = get_marks_analytics(db)

    assignments = get_assignment_analytics(db)

    return {
        "attendance": attendance,
        "marks": marks,
        "assignments": assignments
    }