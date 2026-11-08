from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.pdf_extractor import extract_text_from_pdf
from app.ai.chunker import split_text_into_chunks
from app.ai.retriever import retrieve_relevant_chunks


router = APIRouter(
    prefix="/rag",
    tags=["RAG"]
)


PDF_PATH = r"E:\College Project\ai_documents\notes\Data_Communication.pdf.pdf"


class RAGRequest(BaseModel):
    question: str
    top_k: int = 3


@router.post("/search")
def rag_search(data: RAGRequest):

    # PDF se text extract karo
    text = extract_text_from_pdf(PDF_PATH)

    # Text ko chunks mein divide karo
    chunks = split_text_into_chunks(text)

    # Relevant chunks retrieve karo
    relevant_chunks = retrieve_relevant_chunks(
        data.question,
        chunks,
        top_k=data.top_k
    )

    return {
        "status": "success",
        "question": data.question,
        "results_count": len(relevant_chunks),
        "results": relevant_chunks
    }