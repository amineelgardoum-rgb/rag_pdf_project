from typing import Any, cast
import os

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

from app.core.config import GENERATION_MODEL


def build_generator():
    llm = ChatGoogleGenerativeAI(
        model=GENERATION_MODEL,  # e.g. "gemini-1.5-flash"
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        temperature=0.7,
        # max_output_tokens=512,
    )

    def pipeline(prompt: str, **kwargs):
        response = llm.invoke([
            HumanMessage(content=prompt)
        ])
        print(f"[GEMINI] response: {response.content!r}")

        return [
            {
                "generated_text": response.content
            }
        ]

    return cast(Any, pipeline)