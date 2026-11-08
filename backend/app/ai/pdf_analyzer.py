
from pathlib import Path

from app.ai.ai_assistant import client, PDF_PATH
from app.ai.pdf_extractor import extract_text_from_pdf


def analyze_pdf(pdf_path=PDF_PATH):
    """
    Extract PDF content and generate an AI summary
    using the existing local Ollama model.
    """

    path = Path(pdf_path)

    if not path.exists():
        raise FileNotFoundError(
            f"PDF file not found: {path}"
        )

    # Extract PDF text
    extracted_text = extract_text_from_pdf(str(path))

    if not extracted_text.strip():
        raise ValueError(
            "No readable text found in the PDF."
        )

    # Keep input within a practical context limit
    max_characters = 30000
    was_truncated = len(extracted_text) > max_characters
    document_text = extracted_text[:max_characters]

    prompt = f"""
You are CampusIQ, an academic PDF analyzer.

Analyze the following study material and provide:

1. A clear document summary.
2. Important topics covered.
3. Key definitions and concepts.
4. Important formulas or algorithms, if present.
5. Important exam preparation points.

Rules:
- Use only the supplied document.
- Do not invent information.
- If something is not mentioned, say so.
- Keep the explanation student-friendly.

Document content:
{document_text}
"""

    response = client.chat.completions.create(
        model="qwen3:4b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    summary = response.choices[0].message.content

    return {
        "status": "success",
        "file_name": path.name,
        "summary": summary,
        "characters_analyzed": len(document_text),
        "content_truncated": was_truncated
    }
