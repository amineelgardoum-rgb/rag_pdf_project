from fastapi import APIRouter,Depends,File,HTTPException,Request,UploadFile
# API Router -> groups routes together 
# Depends -> triggers dependency injection
# File -> marks upload field as required
# HTTPException -> returns error responses
# Request -> gives access to app.state
# UploadFile -> type for uploaded files 

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from typing import Optional
from app.core.dependencies import get_embeddings,get_vector_store,set_vector_store
from app.services.rag_service import ingest_pdf 
from app.models.schemas.upload_response import UploadResponse
from app.core.config import UPLOAD_DIR
import shutil
import os 

router=APIRouter()

@router.post("/upload",response_model=UploadResponse)
async def upload_pdf(request:Request,file:UploadFile=File(...),embeddings:HuggingFaceEmbeddings=Depends(get_embeddings),vector_store: Optional[FAISS]=Depends(get_vector_store)):
    if not file.filename or not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400,detail="Only PDF files are accepted!")
    
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)

    file_path=os.path.join(UPLOAD_DIR,file.filename)

    with open(file_path,"wb") as buffer:
        shutil.copyfileobj(file.file,buffer)
    try:
        message,updated_store=ingest_pdf(file_path,embeddings,vector_store)
        set_vector_store(request,updated_store)
        print(f"[UPLOAD] vector_store set. Index size: {updated_store.index.ntotal}")
        return {"message":message,"filename":file.filename}
    finally:
        await file.close()
        if os.path.exists(file_path):
            os.remove(file_path)


