from pydantic import BaseModel
from typing import Optional

class QueryRequest(BaseModel):
    question:str
    source: Optional[str] = None  # e.g. "nlp_book.pdf"