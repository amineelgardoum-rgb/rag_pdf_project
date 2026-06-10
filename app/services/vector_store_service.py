from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document
from app.core.config import FAISS_INDEX_DIR
from typing import List,Optional
import shutil
import os 

def load_vector_store(embeddings:HuggingFaceEmbeddings) -> Optional[FAISS]:
    """if there is vectors just use them directly!"""
    index_file = os.path.join(FAISS_INDEX_DIR, "index.faiss")
    if os.path.exists(index_file):
        return FAISS.load_local(
            FAISS_INDEX_DIR,
            embeddings,
            allow_dangerous_deserialization=True
        )
    return None

def save_vector_store(vector_store:FAISS) -> None:
    """save the vector to the FAISS vector database!"""
    # save the vector to vector database
    vector_store.save_local(FAISS_INDEX_DIR)

def add_chunks(chunks: List[Document], embeddings: HuggingFaceEmbeddings, vector_store: Optional[FAISS]) -> FAISS:
    # delete old index before creating new one
    if os.path.exists(FAISS_INDEX_DIR):
        shutil.rmtree(FAISS_INDEX_DIR)
        os.makedirs(FAISS_INDEX_DIR)
    
    new_store = FAISS.from_documents(chunks, embeddings)
    save_vector_store(new_store)
    return new_store
    
    

def search(question: str, vector_store: FAISS, k: int = 6, source_filter: Optional[str] = None)->list[Document]:
    retriever = vector_store.as_retriever(search_kwargs={"k": k})
    docs = retriever.invoke(question)
    
    if source_filter:
        docs = [d for d in docs if source_filter in d.metadata.get("source", "")]
    
    return docs

def is_ready(vector_store:Optional[FAISS]) -> bool:
    """Check if the vector database is ready!"""
    return vector_store is not None