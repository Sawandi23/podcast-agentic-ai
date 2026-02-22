from services.llm_service import generate_with_ollama


def review_script(script: str) -> str:
    prompt = f"""
You are a content safety and quality reviewer.

Review the following podcast script.

1. Remove or rewrite anything unsafe or inappropriate.
2. Improve clarity and engagement.
3. Keep it professional and conversational.

Script:

{script}
"""

    return generate_with_ollama(prompt)