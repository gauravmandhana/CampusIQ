from app.ai.pdf_extractor import extract_text_from_pdf
from app.ai.chunker import split_text_into_chunks


pdf_path = r"E:\College Project\ai_documents\notes\Data_Communication.pdf.pdf"

text = extract_text_from_pdf(pdf_path)

chunks = split_text_into_chunks(text)

print("Text extracted successfully!")
print("Total chunks:", len(chunks))

for i, chunk in enumerate(chunks[:3], start=1):
    print(f"\n--- Chunk {i} ---")
    print(chunk[:500])