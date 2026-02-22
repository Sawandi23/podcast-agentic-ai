from pydantic import BaseModel

# ------------------------
# Models for API requests
# ------------------------

class ThemeRequest(BaseModel):
    theme: str
    count: int = 5


class TopicSelectionRequest(BaseModel):
    theme: str
    topic: str


class ChatRequest(BaseModel):
    user_message: str