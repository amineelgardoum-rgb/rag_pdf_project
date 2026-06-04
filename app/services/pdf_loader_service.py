from langchain_community.document_loaders import PyPDFLoader # reads the pdf file
from langchain_text_splitters import RecursiveCharacterTextSplitter # splits text into chunks
from langchain_core.documents import Document # Document type hint
from app.core.config import CHUNK_OVERLAP,CHUNK_SIZE # chunk settings 
from typing import List # type hint

def load_pdf(file_path:str) -> List[Document]:
    loader=PyPDFLoader(file_path)
    return loader.load()

def split_documents(documents:List[Document]) -> List[Document]:
    splitter=RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP
    )
    return splitter.split_documents(documents)

def load_and_split(file_path:str) -> List[Document]:
    documents=load_pdf(file_path)
    return split_documents(documents)

