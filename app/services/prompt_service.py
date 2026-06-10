from langchain_core.documents import Document
from typing import List


# prompt_service.py
def build_prompt(question: str, docs: List[Document]) -> str:
    context = _format_context(docs)
    return (
        f"You are a helpful assistant and NLP/ML expert.\n"
        f"Use the context below as your primary source. "
        f"If the context contains partial information, expand on it using your knowledge.\n\n"  
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
        print(f"[Doc {i}] len={len(doc.page_content)} | preview: {doc.page_content[:200]!r}")
        source = doc.metadata.get("source", "unknown")
        page   = doc.metadata.get("page", "?")
        chunks.append(
            f"[{i}] (source: {source}, page: {page})\n{doc.page_content}"
        )
    return "\n\n".join(chunks)