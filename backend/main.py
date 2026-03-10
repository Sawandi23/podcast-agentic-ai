# main.py

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware

# Agents (only if needed individually)
from agents.topic_agent import generate_topics

# Orchestrator
from orchestrator.orchestrator import run_full_pipeline

# Services
from services.llm_service import generate_with_ollama
from services.auth_service import create_user, authenticate_user, create_token, verify_token

# Database
from db.mongo_service import save_episode

# Schemas
from schemas.request_models import (
    ThemeRequest,
    TopicSelectionRequest,
    ChatRequest,
    SignupRequest,
    LoginRequest,
)


app = FastAPI(title="Podcast Agentic AI System")


# ------------------------
# CORS (IMPORTANT for React Frontend)
# ------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to frontend URL later for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------
# Routes
# ------------------------

@app.get("/")
def root():
    return {"message": "Podcast Agentic AI Backend is running 🚀"}


@app.post("/auth/signup")
def signup(request: SignupRequest):
    try:
        user = create_user(request.name, request.email, request.password)
        token = create_token(user)
        return {
            "success": True,
            "data": {
                "user": user,
                "token": token,
            },
            "message": "User signed up successfully",
        }
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@app.post("/auth/login")
def login(request: LoginRequest):
    try:
        user = authenticate_user(request.email, request.password)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_token(user)
        return {
            "success": True,
            "data": {
                "user": user,
                "token": token,
            },
            "message": "User logged in successfully",
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@app.get("/auth/me")
def me(authorization: str = Header(default="")):
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing bearer token")

        token = authorization.removeprefix("Bearer ").strip()
        user = verify_token(token)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        return {
            "success": True,
            "data": {
                "user": user,
            },
            "message": "User fetched successfully",
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


# Generate Topics
@app.post("/generate-topics")
def get_topics(request: ThemeRequest):
    try:
        result = generate_topics(request.theme, request.count, request.more)
        topics = result.get("topics", [])

        return {
            "success": True,
            "data": {
                "theme": request.theme,
                "topics": topics
            },
            "message": f"{len(topics)} topics generated successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Generate Full Podcast (Uses Orchestrator)
@app.post("/generate-full-podcast")
def generate_full_podcast(request: TopicSelectionRequest):
    try:
        result = run_full_pipeline(
            theme=request.theme,
            topic=request.topic
        )

        # Save to MongoDB (pass individual parameters)
        save_episode(
            theme=result.get("theme"),
            topic=result.get("topic"),
            outline=result.get("outline"),
            script=result.get("script")
        )

        return {
            "success": True,
            "data": result,
            "message": "Podcast generated successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# General AI Chat
@app.post("/chat")
def general_chat(request: ChatRequest):
    try:
        response = generate_with_ollama(request.user_message)

        return {
            "success": True,
            "data": {
                "response": response
            },
            "message": "Chat response generated successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))