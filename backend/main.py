# main.py
from fastapi import FastAPI, HTTPException
from db.mongo_service import save_episode  # make sure this exists
from pydantic import BaseModel

# Agents
from agents.topic_agent import generate_topics
from agents.outline_agent import generate_outline
from agents.script_agent import generate_script
from agents.safety_agent import review_script

# Orchestrator
from orchestrator.orchestrator import run_full_pipeline

# Services
from services.llm_service import generate_with_ollama

# Schemas
from schemas.request_models import ThemeRequest, TopicSelectionRequest, ChatRequest

app = FastAPI(title="Podcast Agentic AI System")


# ------------------------
# Routes
# ------------------------

@app.post("/generate-topics")
def get_topics(request: ThemeRequest):
    try:
        topics = generate_topics(request.theme, request.count)
        return {
            "success": True,
            "data": {"topics": topics},
            "message": f"Generated {request.count} topics for theme '{request.theme}'"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-full-podcast")
def generate_full_podcast(request: TopicSelectionRequest):
    try:
        outline = generate_outline(request.topic)
        script = generate_script(outline)
        final_script = review_script(script)

        # Save to MongoDB
        save_episode({
            "theme": request.theme,
            "topic": request.topic,
            "outline": outline,
            "final_script": final_script
        })

        return {
            "theme": request.theme,
            "topic": request.topic,
            "outline": outline,
            "final_script": final_script
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
def general_chat(request: ChatRequest):
    try:
        response = generate_with_ollama(request.user_message)
        return {
            "success": True,
            "data": {"response": response},
            "message": "Chat response generated successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))