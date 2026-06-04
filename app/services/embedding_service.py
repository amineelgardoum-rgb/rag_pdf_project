from langchain_huggingface import HuggingFaceEmbeddings
from app.core.config import EMBEDDING_MODEL

def build_embeddings() -> HuggingFaceEmbeddings:
    """Build the embedding model and return it """
    return HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)