from services.llm_service import generate_with_ollama


def generate_topics(theme: str, count: int = 5, more: bool = False):
    prompt = f"""
    You are a podcast content strategist.
    The user wants to create a podcast about: "{theme}".
    Generate {count} unique, engaging podcast episode topic ideas.
    Return them as a numbered list.
    """
    if more:
        prompt += " The user requested more topics. Continue generating additional ideas."

    response = generate_with_ollama(prompt)
    return {"topics": response.split("\n")}