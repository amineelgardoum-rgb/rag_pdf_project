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
    answer=query_rag(request.question,vector_store,generator)
    return {"answer":answer}
