from pydantic import BaseModel, Field

# ------------------------
# Models for API requests
# ------------------------

class ThemeRequest(BaseModel):
    theme: str = Field(..., min_length=2, max_length=120)
    count: int = Field(default=5, ge=1, le=10)
    more: bool = False


class TopicSelectionRequest(BaseModel):
    theme: str = Field(..., min_length=2, max_length=120)
    topic: str = Field(..., min_length=3, max_length=140)


class ChatRequest(BaseModel):
    user_message: str


class SignupRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    email: str = Field(..., min_length=5, max_length=120)
    password: str = Field(..., min_length=6, max_length=128)


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=5, max_length=120)
    password: str = Field(..., min_length=6, max_length=128)