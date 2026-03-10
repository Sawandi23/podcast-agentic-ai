from services.llm_service import generate_with_ollama
import re


MAX_TOPIC_LENGTH = 110


def _clean_topic_line(line: str) -> str:
    cleaned = re.sub(r"^\s*(\d+[\).:-]?|[-*•])\s*", "", line).strip()
    cleaned = cleaned.strip('"\'')
    cleaned = re.sub(r"\s+", " ", cleaned)

    if len(cleaned) <= MAX_TOPIC_LENGTH:
        return cleaned

    split_parts = re.split(r"[.!?;:\-–—]", cleaned)
    shortened = split_parts[0].strip() if split_parts else cleaned
    if not shortened:
        shortened = cleaned
    return shortened[:MAX_TOPIC_LENGTH].strip()


def _extract_topics(response: str, count: int) -> list[str]:
    lines = [line.strip() for line in response.split("\n") if line.strip()]
    candidate_lines = [
        line
        for line in lines
        if re.match(r"^\s*(\d+[\).:-]?|[-*•])\s+", line)
    ]

    if not candidate_lines:
        candidate_lines = lines

    topics = []
    seen = set()
    for line in candidate_lines:
        topic = _clean_topic_line(line)
        if not topic or topic.lower() in seen:
            continue
        seen.add(topic.lower())
        topics.append(topic)
        if len(topics) >= count:
            break
    return topics


def generate_topics(theme: str, count: int = 5, more: bool = False):
    prompt = f"""
    You are a podcast content strategist.
    The user wants to create a podcast about: "{theme}".
    Generate exactly {count} unique, highly relevant podcast episode title ideas.
    Rules:
    - Keep each title strongly tied to the exact theme.
    - Avoid generic business wording unless the theme itself is business.
    - Keep each topic to a single concise title.
    - Maximum 10 words per topic.
    - Do not add explanations or subtitles.
    Return only a numbered list.
    """
    if more:
        prompt += " The user requested more topics. Continue with fresh ideas and avoid repeats from previous output."

    response = generate_with_ollama(prompt)
    topics = _extract_topics(response, count)
    return {"topics": topics}