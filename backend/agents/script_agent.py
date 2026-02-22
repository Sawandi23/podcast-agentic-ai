from services.llm_service import generate_with_ollama


def generate_script(outline: str) -> str:
    prompt = f"""
Using the following podcast outline:

{outline}

Write a complete engaging podcast script.
Make it conversational and professional.
"""

    return generate_with_ollama(prompt)