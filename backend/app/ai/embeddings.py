from sentence_transformers import SentenceTransformer


# Local embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embeddings(chunks):
    embeddings = model.encode(
        chunks,
        show_progress_bar=True
    )

    return embeddings