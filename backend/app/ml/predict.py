import os
import joblib
import pandas as pd


# Project root directory
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.dirname(os.path.abspath(__file__))
        )
    )
)

# Model path
MODEL_PATH = os.path.join(
    BASE_DIR,
    "backend",
    "ml_models",
    "student_support_model.pkl"
)

# Load trained model
model = joblib.load(MODEL_PATH)


def predict_student_support(
    attendance_percentage,
    average_marks,
    assignment_submission_rate
):
    data = pd.DataFrame([{
        "attendance_percentage": attendance_percentage,
        "average_marks": average_marks,
        "assignment_submission_rate": assignment_submission_rate
    }])

    prediction = model.predict(data)[0]

    if prediction == 1:
        result = "Support Required"
    else:
        result = "No Immediate Support Required"

    return {
        "support_indicator": int(prediction),
        "result": result
    }