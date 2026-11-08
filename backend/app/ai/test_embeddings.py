from app.ai.pdf_extractor import extract_text_from_pdf
from app.ai.chunker import split_text_into_chunks
from app.ai.embeddings import generate_embeddings


pdf_path = r"E:\College Project\ai_documents\notes\Data_Communication.pdf.pdf"

# PDF se text extract
text = extract_text_from_pdf(pdf_path)

# Text ko chunks mein divide
chunks = split_text_into_chunks(text)

# Embeddings generate
embeddings = generate_embeddings(chunks)

print("\nEmbeddings generated successfully!")
print("Number of chunks:", len(chunks))
print("Embedding shape:", embeddings.shape)

print("\nFirst embedding:")
print(embeddings[0][:10])