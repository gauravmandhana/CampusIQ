from fastapi import APIRouter
from pydantic import BaseModel

from app.ml.predict import predict_student_support


router = APIRouter(
    prefix="/ml",
    tags=["Machine Learning"]
)


class StudentPredictionRequest(BaseModel):
    attendance_percentage: float
    average_marks: float
    assignment_submission_rate: float


@router.post("/predict-support")
def predict_support(data: StudentPredictionRequest):

    result = predict_student_support(
        attendance_percentage=data.attendance_percentage,
        average_marks=data.average_marks,
        assignment_submission_rate=data.assignment_submission_rate
    )

    return {
        "status": "success",
        "prediction": result
    }