from openai import OpenAI

from app.ai.pdf_extractor import extract_text_from_pdf
from app.ai.chunker import split_text_into_chunks
from app.ai.retriever import retrieve_relevant_chunks


# Ollama local client
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)

PDF_PATH = r"E:\College Project\ai_documents\notes\Data_Communication.pdf.pdf"


def ask_ai(question):

    # Extract PDF text
    text = extract_text_from_pdf(PDF_PATH)

    # Create chunks
    chunks = split_text_into_chunks(text)

    # Retrieve relevant chunks
    relevant_chunks = retrieve_relevant_chunks(
        question,
        chunks,
        top_k=3
    )

    # Combine retrieved content
    context = "\n\n".join(relevant_chunks)

    prompt = f"""
You are CampusIQ, an AI assistant for college students.

Answer the student's question using the provided study material.

If the answer is not available in the provided study material,
clearly say that the information is not available in the uploaded
study material.

Do not invent college-specific information.

Study Material:
{context}

Student Question:
{question}
"""

    response = client.chat.completions.create(
        model="qwen3:4b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    answer = response.choices[0].message.content

    return {
        "question": question,
        "answer": answer,
        "sources": relevant_chunks
    }