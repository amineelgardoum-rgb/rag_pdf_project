from typing import Any, cast
from transformers import (
    T5ForConditionalGeneration,
    T5Tokenizer,
    pipeline
)

from app.core.config import GENERATION_MODEL


def build_generator():
    tokenizer = T5Tokenizer.from_pretrained(GENERATION_MODEL)
    model = T5ForConditionalGeneration.from_pretrained(GENERATION_MODEL)

    return cast(
        Any,
        pipeline(
            "text2text-generation",  # type: ignore[call-arg]
            model=model,
            tokenizer=tokenizer,
            max_new_tokens=512,
        ),
    )