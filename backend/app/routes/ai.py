
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.ai.ai_assistant import ask_ai
from app.ai.pdf_analyzer import analyze_pdf


router = APIRouter(
    prefix="/ai",
    tags=["AI Assistant"]
)


class AIQuestionRequest(BaseModel):
    question: str


@router.post("/ask")
def ask_question(data: AIQuestionRequest):
    try:
        result = ask_ai(data.question)

        return {
            "status": "success",
            "question": result["question"],
            "answer": result["answer"],
            "sources": result["sources"]
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.post("/analyze-pdf")
def analyze_uploaded_pdf():
    try:
        return analyze_pdf()

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
