from services.llm_service import generate_with_ollama


def generate_outline(topic: str) -> str:
    prompt = f"""
Create a structured podcast outline for the following topic:

{topic}

Include:
- Introduction
- 3–5 Main Sections
- Conclusion
"""

    return generate_with_ollama(prompt)