from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document
from app.services.pdf_loader_service import load_and_split
from app.services.vector_store_service import add_chunks,search
from typing import Optional,Tuple
from app.services.prompt_service import build_prompt

def ingest_pdf(file_path:str,embeddings:HuggingFaceEmbeddings,vector_store:Optional[FAISS]) -> Tuple[str,FAISS]:
    """ this a function to ingest the pdf file , also return the vectors stored in the FAISS database!"""
    chunks=load_and_split(file_path)
    updated_store=add_chunks(chunks,embeddings,vector_store)
    message=f"Successfully ingested {len(chunks)} chunks from {file_path}."
    return message,updated_store

def query_rag(
    question: str,
    vector_store: Optional[FAISS],
    generator
) -> str:
    if vector_store is None:
        return "No document ingested yet. Please upload a PDF first."

    docs = search(question, vector_store)

    if not docs:
        return "No relevant content found for your question."

    prompt = build_prompt(question, docs)

    result = generator(prompt)
    generated = result[0]["generated_text"]

    if generated and generated.strip():
        return generated.strip()

    return "Could not generate an answer."