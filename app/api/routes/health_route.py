from fastapi import APIRouter

router=APIRouter()

@router.get("/health")
def health():
    print("[INFO] The health Endpoint is Triggered !")
    return {"status":200,"message":"The API is working "}

