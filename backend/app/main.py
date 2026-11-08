
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import engine
from app.database.models import Base

from app.routes import ai

from app.routes.student import router as student_router
from app.routes.faculty import router as faculty_router
from app.routes.notes import router as notes_router
from app.routes.notices import router as notices_router
from app.routes.events import router as events_router
from app.routes.timetable import router as timetable_router
from app.routes.auth import router as auth_router
from app.routes.admin import router as admin_router
from app.routes.analytics import router as analytics_router
from app.routes.ml_predict import router as ml_predict_router
from app.routes.rag import router as rag_router
from app.routes.assignments import router as assignments_router
from app.routes.attendance import router as attendance_router

from app.models.student import Student
from app.models.faculty import Faculty
from app.models.department import Department
from app.models.subject import Subject
from app.models.attendance import Attendance
from app.models.marks import Marks
from app.models.assignment import Assignment
from app.models.submission import Submission
from app.models.note import Note
from app.models.exam import Exam
from app.models.timetable import Timetable
from app.models.notice import Notice
from app.models.event import Event
from app.models.document import Document
from app.models.ai_conversation import AIConversation


# =====================================================
# DATABASE
# =====================================================

Base.metadata.create_all(bind=engine)


# =====================================================
# FASTAPI APPLICATION
# =====================================================

app = FastAPI(
    title="CampusIQ API",
    description="AI-Powered Student Assistance & Campus Analytics Platform",
    version="1.0.0"
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# STATIC FILES / UPLOADS
# =====================================================

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOADS_DIR = BASE_DIR / "uploads"

app.mount(
    "/uploads",
    StaticFiles(directory=str(UPLOADS_DIR)),
    name="uploads"
)


# =====================================================
# API ROUTES
# =====================================================

app.include_router(student_router)
app.include_router(faculty_router)
app.include_router(notes_router)
app.include_router(notices_router)
app.include_router(events_router)
app.include_router(timetable_router)
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(analytics_router)
app.include_router(ml_predict_router)
app.include_router(rag_router)
app.include_router(ai.router)
app.include_router(assignments_router)
app.include_router(attendance_router)


# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():
    return {
        "message": "CampusIQ API is running!",
        "status": "success"
    }


# =====================================================
# HEALTH CHECK
# =====================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
