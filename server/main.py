"""
Module: server.main
Purpose: FastAPI application entry point and API routers
Author: Backend Developer Agent
Created: 2026-08-21
"""

import os
import json
import asyncio
import logging
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from server.database import get_db, init_db
from server.models import ChatSession, ChatMessage

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize database tables on startup
init_db()

app = FastAPI(
    title="ChatGPT-like API",
    description="FastAPI backend for a ChatGPT-like streaming chat application",
    version="1.0.0",
)

# CORS Middleware configuration
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic Schemas
class ChatCreate(BaseModel):
    title: Optional[str] = Field(
        None, description="Optional initial title for the chat session"
    )


class ChatResponse(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ChatRename(BaseModel):
    title: str = Field(..., min_length=1, description="New title for the chat session")


class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1, description="Content of the message")


class MessageResponse(BaseModel):
    id: str
    chat_id: str
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


# API Endpoints


@app.get("/health", response_model=dict)
def health_check():
    """
    Simple health check endpoint.
    """
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}


@app.post(
    "/api/v1/chats", response_model=ChatResponse, status_code=status.HTTP_201_CREATED
)
def create_chat(chat_data: Optional[ChatCreate] = None, db: Session = Depends(get_db)):
    """
    Create a new chat session.
    """
    title = "New Chat"
    if chat_data and chat_data.title:
        title = chat_data.title

    new_chat = ChatSession(title=title)
    db.add(new_chat)
    try:
        db.commit()
        db.refresh(new_chat)
        return new_chat
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating chat: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not create chat session",
        )


@app.get("/api/v1/chats", response_model=List[ChatResponse])
def list_chats(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Max number of records to return"),
    db: Session = Depends(get_db),
):
    """
    List all chat sessions, sorted by most recent activity (updated_at descending).
    """
    chats = (
        db.query(ChatSession)
        .order_by(ChatSession.updated_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return chats


@app.get("/api/v1/chats/{chat_id}/messages", response_model=List[MessageResponse])
def get_chat_messages(chat_id: str, db: Session = Depends(get_db)):
    """
    Retrieve all messages for a specific chat session, sorted chronologically.
    """
    chat = db.query(ChatSession).filter(ChatSession.id == chat_id).first()
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chat session not found"
        )
    return chat.messages


@app.patch("/api/v1/chats/{chat_id}", response_model=ChatResponse)
def rename_chat(chat_id: str, rename_data: ChatRename, db: Session = Depends(get_db)):
    """
    Rename a chat session title.
    """
    chat = db.query(ChatSession).filter(ChatSession.id == chat_id).first()
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chat session not found"
        )

    chat.title = rename_data.title
    chat.updated_at = datetime.now(timezone.utc)
    try:
        db.commit()
        db.refresh(chat)
        return chat
    except Exception as e:
        db.rollback()
        logger.error(f"Error renaming chat: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not rename chat session",
        )


@app.delete("/api/v1/chats/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_chat(chat_id: str, db: Session = Depends(get_db)):
    """
    Delete a chat session and all its associated messages (cascading).
    """
    chat = db.query(ChatSession).filter(ChatSession.id == chat_id).first()
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chat session not found"
        )

    try:
        db.delete(chat)
        db.commit()
        return
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting chat: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not delete chat session",
        )


# Helper function to generate mock streaming responses
async def mock_llm_stream(prompt: str):
    """
    Simulates a streaming response from an LLM with realistic typing speed.
    """
    prompt_lower = prompt.lower()
    if "quantum computing" in prompt_lower:
        response_text = (
            "Quantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics "
            "to solve problems too complex for classical computers.\n\n"
            "Unlike classical computers, which use bits (0s and 1s) as the basic unit of information, "
            "quantum computers use qubits. Qubits can exist in a state of superposition, meaning they can "
            "represent a 0, a 1, or both simultaneously. This allows quantum computers to process vast amounts "
            "of possibilities at once, enabling breakthroughs in cryptography, optimization, and molecular modeling."
        )
    elif "python script" in prompt_lower or "rest api" in prompt_lower:
        response_text = (
            "Here is a simple FastAPI REST API script in Python:\n\n"
            "```python\n"
            "from fastapi import FastAPI\n\n"
            "app = FastAPI()\n\n"
            "@app.get('/')\n"
            "def read_root():\n"
            "    return {'message': 'Hello World'}\n"
            "```\n\n"
            "You can run this script using Uvicorn:\n"
            "```bash\n"
            "uvicorn main:app --reload\n"
            "```"
        )
    elif "database schema" in prompt_lower:
        response_text = (
            "To design a database schema for a chat application, you typically need at least two tables:\n\n"
            "1. **chats**: Stores session metadata (id, title, created_at, updated_at).\n"
            "2. **messages**: Stores individual messages (id, chat_id, role, content, created_at).\n\n"
            "The `messages` table should have a foreign key referencing `chats.id` with a cascading delete constraint."
        )
    else:
        response_text = (
            f"Hello! I am a ChatGPT-like AI assistant. I received your message: '{prompt}'.\n\n"
            "I can help you brainstorm ideas, write code, explain complex topics, or assist with daily tasks. "
            "What would you like to explore next?"
        )

    # Split response into small chunks to simulate streaming
    words = response_text.split(" ")
    for i, word in enumerate(words):
        chunk = word + (" " if i < len(words) - 1 else "")
        yield chunk
        await asyncio.sleep(0.03)  # Simulate typing delay


async def real_openai_stream(prompt: str, api_key: str):
    """
    Streams responses from the real OpenAI API.
    """
    try:
        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=api_key)
        response = await client.chat.completions.create(
            model="gpt-4o", messages=[{"role": "user", "content": prompt}], stream=True
        )
        async for chunk in response:
            content = chunk.choices[0].delta.content
            if content:
                yield content
    except Exception as e:
        logger.error(f"Error streaming from OpenAI: {e}")
        # Fallback to mock stream if real API fails
        async for chunk in mock_llm_stream(prompt):
            yield chunk


@app.post("/api/v1/chats/{chat_id}/messages")
async def send_message(
    chat_id: str, message_data: MessageCreate, db: Session = Depends(get_db)
):
    """
    Send a new message to a chat session and initiate the SSE stream.
    """
    # 1. Verify chat session exists
    chat = db.query(ChatSession).filter(ChatSession.id == chat_id).first()
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chat session not found"
        )

    # 2. Save user message to database
    user_msg = ChatMessage(chat_id=chat_id, role="user", content=message_data.content)
    db.add(user_msg)

    # Update chat session's updated_at timestamp and auto-rename if it's the first message
    chat.updated_at = datetime.now(timezone.utc)
    if chat.title == "New Chat" or not chat.title:
        # Use first few words of user message as title (max 30 chars)
        words = message_data.content.split()
        title_candidate = " ".join(words[:5])
        if len(title_candidate) > 30:
            title_candidate = title_candidate[:27] + "..."
        chat.title = title_candidate or "New Chat"

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Error saving user message: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not save user message",
        )

    # 3. Prepare streaming generator
    async def sse_generator():
        openai_api_key = os.getenv("OPENAI_API_KEY")

        # Determine whether to use real OpenAI or mock
        if (
            openai_api_key
            and not openai_api_key.startswith("mock")
            and not openai_api_key.startswith("your_")
        ):
            stream_gen = real_openai_stream(message_data.content, openai_api_key)
        else:
            stream_gen = mock_llm_stream(message_data.content)

        accumulated_content = ""
        try:
            async for chunk in stream_gen:
                accumulated_content += chunk
                # Format as SSE event
                yield f"data: {json.dumps({'content': chunk})}\n\n"
        except GeneratorExit:
            logger.info("Client disconnected from SSE stream (Stop Generating).")
        except Exception as e:
            logger.error(f"Error in SSE generator: {e}")
            yield f"data: {json.dumps({'error': 'An error occurred during generation.'})}\n\n"
        finally:
            # Save assistant message to database
            if accumulated_content:
                # We need a fresh DB session because the request session might be closed or in a different thread
                from server.database import SessionLocal as LocalSession

                with LocalSession() as local_db:
                    assistant_msg = ChatMessage(
                        chat_id=chat_id, role="assistant", content=accumulated_content
                    )
                    local_db.add(assistant_msg)
                    # Also update the chat session's updated_at timestamp
                    local_chat = (
                        local_db.query(ChatSession)
                        .filter(ChatSession.id == chat_id)
                        .first()
                    )
                    if local_chat:
                        local_chat.updated_at = datetime.now(timezone.utc)
                    try:
                        local_db.commit()
                        logger.info("Successfully saved assistant message to database.")
                    except Exception as db_err:
                        local_db.rollback()
                        logger.error(
                            f"Error saving assistant message in finally block: {db_err}"
                        )

    return StreamingResponse(sse_generator(), media_type="text/event-stream")
