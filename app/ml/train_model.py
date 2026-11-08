import os
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib


# Project paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

DATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "student_performance.csv"
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "ml_models"
)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "student_support_model.pkl"
)


# Load dataset
df = pd.read_csv(DATA_PATH)

print("Dataset loaded successfully")
print("Dataset shape:", df.shape)
print(df.head())


# Features
X = df[
    [
        "attendance_percentage",
        "average_marks",
        "assignment_submission_rate"
    ]
]

# Target
y = df["support_indicator"]


# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# Create model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)


# Train model
model.fit(X_train, y_train)


# Prediction
y_pred = model.predict(X_test)


# Evaluation
accuracy = accuracy_score(y_test, y_pred)

print("\nModel Training Completed")
print("Accuracy:", round(accuracy * 100, 2), "%")

print("\nClassification Report:")
print(classification_report(y_test, y_pred))


# Create model directory
os.makedirs(MODEL_DIR, exist_ok=True)


# Save model
joblib.dump(model, MODEL_PATH)

print("\nModel saved successfully:")
print(MODEL_PATH)