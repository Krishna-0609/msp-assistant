from fastapi import APIRouter, HTTPException, status, Query
from app.schemas.chat import ChatRequest, ChatResponse, ChatMessage
from app.services.bedrock import get_bedrock_response
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Mock conversations
CONVERSATIONS = {}


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat with AI assistant powered by Claude"""

    # Get or create conversation
    conversation_id = request.conversation_id or f"conv-{len(CONVERSATIONS) + 1}"

    if conversation_id not in CONVERSATIONS:
        CONVERSATIONS[conversation_id] = []

    # Add user message
    user_msg = ChatMessage(role="user", content=request.message)
    CONVERSATIONS[conversation_id].append(user_msg)

    logger.info(f"Chat message received in conversation {conversation_id}")

    # Get AI response (in production, call Bedrock)
    ai_response_text = await get_bedrock_response(
        message=request.message,
        account_id=request.account_id,
        context=CONVERSATIONS[conversation_id],
    )

    ai_msg = ChatMessage(role="assistant", content=ai_response_text, confidence=78)

    CONVERSATIONS[conversation_id].append(ai_msg)

    return {"conversation_id": conversation_id, "message": user_msg, "response": ai_msg}


@router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    """Get conversation history"""
    if conversation_id not in CONVERSATIONS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found"
        )

    return {
        "id": conversation_id,
        "messages": CONVERSATIONS[conversation_id],
        "message_count": len(CONVERSATIONS[conversation_id]),
    }


@router.get("/conversations")
async def list_conversations(limit: int = Query(20, le=100)):
    """List all conversations"""
    return {
        "total": len(CONVERSATIONS),
        "conversations": list(CONVERSATIONS.keys())[:limit],
    }


@router.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    """Delete a conversation"""
    if conversation_id not in CONVERSATIONS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found"
        )

    del CONVERSATIONS[conversation_id]
    logger.info(f"Conversation {conversation_id} deleted")

    return {"message": "Conversation deleted"}
