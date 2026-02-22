# backend/orchestrator/orchestrator.py

from agents.outline_agent import generate_outline
from agents.script_agent import generate_script
from agents.safety_agent import review_script

def run_full_pipeline(theme: str, topic: str):
    """
    Full podcast generation pipeline:
    1. Outline generation
    2. Script generation
    3. Safety review
    Returns a clean dict for API response.
    """
    # 1️⃣ Generate outline for the topic
    outline = generate_outline(topic)

    # 2️⃣ Generate script from the outline
    script = generate_script(outline)

    # 3️⃣ Safety review
    safe_script = review_script(script)

    # 4️⃣ Return everything
    return {
        "theme": theme,
        "topic": topic,
        "outline": outline,
        "script": safe_script
    }