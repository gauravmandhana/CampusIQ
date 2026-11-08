from sqlalchemy.orm import Session
from app.models.attendance import Attendance


def get_attendance_analytics(db: Session):
    attendance_records = db.query(Attendance).all()

    total_classes = len(attendance_records)

    present_classes = sum(
        1 for record in attendance_records
        if record.status == 1
    )

    absent_classes = total_classes - present_classes

    if total_classes > 0:
        attendance_percentage = round(
            (present_classes / total_classes) * 100,
            2
        )
    else:
        attendance_percentage = 0

    return {
        "total_classes": total_classes,
        "present_classes": present_classes,
        "absent_classes": absent_classes,
        "attendance_percentage": attendance_percentage
    }