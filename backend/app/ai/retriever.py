from app.ai.embeddings import model
from app.ai.vector_store import load_vector_store


def retrieve_relevant_chunks(
    question,
    chunks,
    top_k=3
):
    # Question ka embedding generate karo
    question_embedding = model.encode(
        [question]
    )

    # FAISS index load karo
    index = load_vector_store()

    # Search ke liye float32
    question_embedding = question_embedding.astype(
        "float32"
    )

    # Similar chunks search karo
    distances, indices = index.search(
        question_embedding,
        top_k
    )

    relevant_chunks = []

    for index_number in indices[0]:
        if index_number < len(chunks):
            relevant_chunks.append(
                chunks[index_number]
            )

    return relevant_chunks