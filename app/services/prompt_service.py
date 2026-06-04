from langchain_core.documents import Document
from typing import List


def build_prompt(question: str, docs: List[Document]) -> str:
    """
    Build a prompt from the question and retrieved chunks.
    Structures the context so the model knows exactly what to do.
    """
    context = _format_context(docs)

    return (
        f"You are a helpful assistant. "
        f"Answer the question using ONLY the context provided below. "
        f"If the answer is not in the context, say 'I don't know'.\n\n"
        f"Context:\n{context}\n\n"
        f"Question: {question}\n\n"
        f"Answer:"
    )


def _format_context(docs: List[Document]) -> str:
    """
    Format retrieved chunks into a clean numbered context block.
    Numbers help the model distinguish between separate chunks.
    """
    chunks = []
    for i, doc in enumerate(docs, start=1):
        source = doc.metadata.get("source", "unknown")
        page   = doc.metadata.get("page", "?")
        chunks.append(
            f"[{i}] (source: {source}, page: {page})\n{doc.page_content}"
        )
    return "\n\n".join(chunks)