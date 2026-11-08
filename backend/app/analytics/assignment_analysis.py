from sqlalchemy.orm import Session

from app.models.assignment import Assignment
from app.models.submission import Submission


def get_assignment_analytics(db: Session):
    assignments = db.query(Assignment).all()
    submissions = db.query(Submission).all()

    total_assignments = len(assignments)
    total_submissions = len(submissions)

    pending_assignments = max(
        total_assignments - total_submissions,
        0
    )

    if total_assignments > 0:
        submission_rate = round(
            (total_submissions / total_assignments) * 100,
            2
        )
    else:
        submission_rate = 0

    return {
        "total_assignments": total_assignments,
        "total_submissions": total_submissions,
        "pending_assignments": pending_assignments,
        "submission_rate": submission_rate
    }