from fastapi import Request
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from typing import Optional
from app.services.generation_service import build_generator

def get_embeddings(request:Request) -> HuggingFaceEmbeddings:
    """
    Get the embeddings , the first time the client sent a Request to
    Args:
        request: Current HTTP request.
    Returns:
        The Huggingface instance to inject it into the app.
    """
    return request.app.state.embeddings

def get_vector_store(request:Request) -> Optional[FAISS]:
    """
    Get the vectors stored in the FAISS index
    Args:
        request: Current HTTP request.
    Returns:
        the FAISS vector store if it exists, OtherWise None.
    """
    return request.app.state.vector_store

def set_vector_store(request: Request, vector_store: FAISS) -> None:
    """
    Update the application's FAISS vector store.

    This function stores a FAISS index in the FastAPI application state,
    making it accessible across all requests.

    Args:
        request: Current HTTP request.
        vector_store: FAISS index containing document embeddings.

    Returns:
        None.
    """
    request.app.state.vector_store = vector_store

def get_generator(request: Request):
    """
    Returns the generator from app.state.
    If it hasn't been built yet (lazy loading), builds it once and caches it.
    Every request after the first one gets the cached version instantly.
    """
    if request.app.state.generator is None:
        request.app.state.generator = build_generator()
    return request.app.state.generator