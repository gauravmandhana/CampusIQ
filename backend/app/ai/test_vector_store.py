from app.ai.pdf_extractor import extract_text_from_pdf
from app.ai.chunker import split_text_into_chunks
from app.ai.embeddings import generate_embeddings
from app.ai.vector_store import create_vector_store


pdf_path = r"E:\College Project\ai_documents\notes\Data_Communication.pdf.pdf"


# Step 1: Extract PDF text
text = extract_text_from_pdf(pdf_path)

# Step 2: Create chunks
chunks = split_text_into_chunks(text)

# Step 3: Generate embeddings
embeddings = generate_embeddings(chunks)

# Step 4: Create FAISS vector store
index = create_vector_store(embeddings)


print("\nVector store created successfully!")
print("Total chunks stored:", index.ntotal)
print("Vector dimension:", index.d)