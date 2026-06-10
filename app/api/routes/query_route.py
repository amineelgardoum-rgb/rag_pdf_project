from fastapi import APIRouter,Depends
from langchain_community.vectorstores import FAISS
from typing import Optional
from app.core.dependencies import get_vector_store
from app.services.rag_service import query_rag
from app.models.schemas.query_request import QueryRequest
from app.models.schemas.query_response import QueryResponse
from app.core.dependencies import get_generator
router=APIRouter()

@router.post("/query",response_model=QueryResponse)
async def query(request:QueryRequest,vector_store:Optional[FAISS]=Depends(get_vector_store),generator=Depends(get_generator)):
    print("[INFO] THe query endpoint is triggered !")
    print(f"[QUERY] vector_store type: {type(vector_store)}")
    if vector_store:
        print(f"[QUERY] Index size: {vector_store.index.ntotal}")
    answer = query_rag(request.question, vector_store, generator,request.source)
    return {"answer":answer}