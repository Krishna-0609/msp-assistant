from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str = Field(..., min_length=1, max_length=5000)
    confidence: Optional[float] = Field(None, ge=0, le=100)


class ChatMessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    confidence: Optional[float]
    timestamp: datetime

    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000)
    conversation_id: Optional[str] = None
    account_id: str


class ChatResponse(BaseModel):
    conversation_id: str
    message: ChatMessage
    response: ChatMessage


class ConversationResponse(BaseModel):
    id: str
    title: Optional[str]
    created_at: datetime
    updated_at: datetime
    message_count: int

    class Config:
        from_attributes = True
