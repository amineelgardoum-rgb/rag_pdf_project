# RAG-based PDF Query API

This project provides a Retrieval-Augmented Generation (RAG) API built with FastAPI. It allows users to upload PDF documents, ingest them into a vector store (FAISS), and perform intelligent queries against the content of these documents.

## Features

- **PDF Ingestion:** Easily upload and parse PDF documents.
- **Vector Search:** Uses FAISS for efficient storage and retrieval of document chunks.
- **Intelligent Querying:** Leverages RAG to provide context-aware answers to user queries based on the uploaded PDFs.
- **FastAPI Backend:** A lightweight, high-performance API structure.

## Architecture

![RAG Workflow](docs/RAG/RAG.png)

## Project Structure

- `app/`: Contains the FastAPI application logic.
  - `api/routes/`: API endpoints (`upload`, `query`, etc.)
  - `core/`: Configuration and dependency management.
  - `models/`: Pydantic schemas for request/response validation.
  - `services/`: Core logic for PDF processing, embeddings, RAG, and vector store management.

## API Documentation

![API Overview](docs/API/docs.png)

### Endpoints

- **Home:** ![Home Endpoint](docs/API/home_endpoint.png)
- **Upload:**
  - Endpoint: ![Upload Endpoint](docs/API/upload_endpoint.png)
  - Details: ![Upload Details](docs/API/upload.png)
- **Query:**
  - Endpoint: ![Query Endpoint](docs/API/query_endpoint.png)
  - Details: ![Query Details](docs/API/query.png)

## Getting Started

1. **Clone the repository.**
2. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application:**

   ```bash
   # (Assuming main.py is the entry point)
   python -m app.main
   ```

## Recent Updates

- Added demo video.
- Improved documentation and API explanations.
- Added file deletion support in the upload router.
- Fixed embedding issues.
