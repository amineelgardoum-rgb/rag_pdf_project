from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.config import UPLOAD_DIR,FAISS_INDEX_DIR
from app.services.embedding_service import build_embeddings
from app.services.vector_store_service import load_vector_store

import os 

@asynccontextmanager
async def lifespan(app:FastAPI):
    """lifespan to manage the dependencies (embedding , vector_store) , inject once """
    os.makedirs(UPLOAD_DIR,exist_ok=True)
    os.makedirs(FAISS_INDEX_DIR,exist_ok=True)
    app.state.embeddings=build_embeddings()
    app.state.vector_store=load_vector_store(app.state.embeddings)
    app.state.generator=None

    yield