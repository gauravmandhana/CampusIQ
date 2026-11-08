from sqlalchemy import text
from sqlalchemy.orm import Session


def get_marks_analytics(db: Session):

    query = text("""
        SELECT
            m.id,
            m.student_id,
            m.subject_id,
            m.internal_marks,
            m.midterm_marks,
            m.practical_marks,
            m.endterm_marks,
            m.total_marks,
            s.name AS subject_name
        FROM marks m
        LEFT JOIN subjects s
            ON m.subject_id = s.id
        ORDER BY m.id
    """)

    result = db.execute(query)

    rows = result.mappings().all()

    if not rows:
        return {
            "total_subjects": 0,
            "total_marks": 0,
            "average_marks": 0,
            "highest_marks": 0,
            "lowest_marks": 0,
            "subject_wise_marks": []
        }

    totals = [
        float(row["total_marks"])
        for row in rows
        if row["total_marks"] is not None
    ]

    subject_wise_marks = []

    for row in rows:
        subject_wise_marks.append({
            "subject_id": row["subject_id"],
            "subject_name": row["subject_name"] or "Unknown Subject",
            "internal_marks": row["internal_marks"],
            "midterm_marks": row["midterm_marks"],
            "practical_marks": row["practical_marks"],
            "endterm_marks": row["endterm_marks"],
            "total_marks": row["total_marks"]
        })

    if not totals:
        return {
            "total_subjects": len(rows),
            "total_marks": 0,
            "average_marks": 0,
            "highest_marks": 0,
            "lowest_marks": 0,
            "subject_wise_marks": subject_wise_marks
        }

    total_marks = sum(totals)

    average_marks = round(
        total_marks / len(totals),
        2
    )

    highest_marks = max(totals)

    lowest_marks = min(totals)

    return {
        "total_subjects": len(totals),
        "total_marks": total_marks,
        "average_marks": average_marks,
        "highest_marks": highest_marks,
        "lowest_marks": lowest_marks,
        "subject_wise_marks": subject_wise_marks
    }