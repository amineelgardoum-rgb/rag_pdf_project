from dotenv import load_dotenv
import os 

load_dotenv()

APP_NAME = os.getenv("APP_NAME","RAG System") # the name of the app
UPLOAD_DIR = os.getenv("UPLOAD_DIR","uploads") # the upload dir for the pdf files from the client
FAISS_INDEX_DIR = os.getenv("FAISS_INDEX_DIR","faiss_index") # the index fiass for the FIASS indexing 
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL","all-MiniLM-L6-v2") # the embedding model 
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE",1000)) # the chunk size 
CHUNK_OVERLAP= int (os.getenv("CHUNK_OVERLAP",200)) # the overlap 
GENERATION_MODEL = os.getenv("GENERATION_MODEL", "gemini-2.5-flash")