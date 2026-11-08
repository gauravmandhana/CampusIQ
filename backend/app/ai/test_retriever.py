from app.ai.pdf_extractor import extract_text_from_pdf
from app.ai.chunker import split_text_into_chunks
from app.ai.retriever import retrieve_relevant_chunks


pdf_path = r"E:\College Project\ai_documents\notes\Data_Communication.pdf.pdf"


# PDF text extract karo
text = extract_text_from_pdf(pdf_path)

# Same chunks generate karo
chunks = split_text_into_chunks(text)


question = "What is Caesar Cipher?"


# Relevant chunks retrieve karo
results = retrieve_relevant_chunks(
    question,
    chunks,
    top_k=3
)


print("\nQuestion:")
print(question)

print("\nRelevant chunks:")

for i, chunk in enumerate(results, start=1):
    print(f"\n--- Result {i} ---")
    print(chunk[:1000])