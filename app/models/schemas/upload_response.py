from pydantic import BaseModel # data validation and parsing 

class UploadResponse(BaseModel):
    message:str
    filename:str