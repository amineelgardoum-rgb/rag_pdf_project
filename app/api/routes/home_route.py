from fastapi import APIRouter

router=APIRouter()

@router.get("/")
def home():
    print("[INFO]:The home endpoint is triggered!")
    return {"message":"Welcome to the RAG system!"}