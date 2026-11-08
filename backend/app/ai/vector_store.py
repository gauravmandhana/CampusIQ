import os
import faiss
import numpy as np


BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.dirname(os.path.abspath(__file__))
        )
    )
)

VECTOR_DIR = os.path.join(
    BASE_DIR,
    "backend",
    "ml_models"
)

INDEX_PATH = os.path.join(
    VECTOR_DIR,
    "campusiq_faiss.index"
)


def create_vector_store(embeddings):
    embeddings = np.array(
        embeddings,
        dtype="float32"
    )

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)

    index.add(embeddings)

    os.makedirs(VECTOR_DIR, exist_ok=True)

    faiss.write_index(
        index,
        INDEX_PATH
    )

    return index


def load_vector_store():
    if not os.path.exists(INDEX_PATH):
        raise FileNotFoundError(
            "FAISS index not found. Create the vector store first."
        )

    return faiss.read_index(INDEX_PATH)