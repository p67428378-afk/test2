import os
import json
import asyncio
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from server.database import get_db, init_db, SessionLocal, seed_data
import server.models as models

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="ChatGPT-like API",
    version="1.0.0",
    lifespan=lifespan
)

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class ChatCreate(BaseModel):
    title: Optional[str] = "New Chat"

class ChatRename(BaseModel):
    title: str

class ChatResponse(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: str
    chat_id: str
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

# Helper for SSE streaming
async def generate_ai_response(chat_id: str, user_content: str):
    user_content_lower = user_content.lower()
    if "sse" in user_content_lower or "fastapi" in user_content_lower or "server-sent" in user_content_lower:
        response_text = (
            "To implement Server-Sent Events (SSE) in FastAPI for streaming LLM responses, "
            "you can use the StreamingResponse class from fastapi.responses. Here is a step-by-step guide:\n\n"
            "1. Install dependencies: Make sure you have fastapi and uvicorn installed.\n"
            "2. Create a generator function: This function will yield chunks of data formatted as SSE events (e.g., data: chunk\\n\\n).\n"
            "3. Return a StreamingResponse: Pass the generator to StreamingResponse with the media type text/event-stream."
        )
    elif "quantum" in user_content_lower:
        response_text = (
            "Quantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics "
            "to solve problems too complex for classical computers. These machines are very different from "
            "the classical computers that we use today."
        )
    elif "rest" in user_content_lower or "python" in user_content_lower or "script" in user_content_lower:
        response_text = (
            "Here is a simple Python script for a REST API using FastAPI:\n\n"
            "```python\n"
            "from fastapi import FastAPI\n\n"
            "app = FastAPI()\n\n"
            "@app.get('/')\n"
            "def read_root():\n"
            "    return {'Hello': 'World'}\n"
            "```"
        )
    elif "schema" in user_content_lower or "database" in user_content_lower:
        response_text = (
            "Designing a database schema for a chat app typically involves at least two tables: "
            "`chats` (or `sessions`) and `messages`. The `messages` table has a foreign key pointing to "
            "`chats.id` with a cascade delete constraint."
        )
    elif "brainstorm" in user_content_lower or "names" in user_content_lower or "startup" in user_content_lower:
        response_text = (
            "Here are some creative names for your AI startup:\n"
            "1. ChatForge\n"
            "2. PromptStream\n"
            "3. SynapseAI\n"
            "4. LexiFlow\n"
            "5. CogniChat"
        )
    else:
        response_text = (
            "I can certainly help you with that! What topic would you like to discuss or "
            "what question do you have today?"
        )

    # Split response into small chunks (words)
    chunks = []
    words = response_text.split(" ")
    for i, word in enumerate(words):
        if i < len(words) - 1:
            chunks.append(word + " ")
        else:
            chunks.append(word)

    accumulated_content = ""
    saved = False

    try:
        for chunk in chunks:
            accumulated_content += chunk
            yield f"data: {json.dumps({'content': chunk, 'done': False})}\n\n"
            await asyncio.sleep(0.02)  # Simulate streaming delay
        
        # Save full response
        db = SessionLocal()
        try:
            ai_message = models.Message(
                chat_id=chat_id,
                role="assistant",
                content=accumulated_content
            )
            db.add(ai_message)
            chat = db.query(models.Chat).filter(models.Chat.id == chat_id).first()
            if chat:
                chat.updated_at = datetime.now(timezone.utc)
            db.commit()
            saved = True
            yield f"data: {json.dumps({'content': '', 'done': True, 'message_id': ai_message.id})}\n\n"
        except Exception:
            db.rollback()
        finally:
            db.close()

    except asyncio.CancelledError:
        # Client disconnected / stopped generating
        if not saved and accumulated_content.strip():
            db = SessionLocal()
            try:
                ai_message = models.Message(
                    chat_id=chat_id,
                    role="assistant",
                    content=accumulated_content
                )
                db.add(ai_message)
                chat = db.query(models.Chat).filter(models.Chat.id == chat_id).first()
                if chat:
                    chat.updated_at = datetime.now(timezone.utc)
                db.commit()
            except Exception:
                db.rollback()
            finally:
                db.close()
        raise

# API Endpoints
@app.post("/api/v1/chats", response_model=ChatResponse, status_code=status.HTTP_201_CREATED)
def create_chat(chat_in: Optional[ChatCreate] = None, db: Session = Depends(get_db)):
    title = chat_in.title if (chat_in and chat_in.title) else "New Chat"
    chat = models.Chat(title=title)
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat

@app.get("/api/v1/chats", response_model=List[ChatResponse])
def list_chats(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    # Sort by updated_at descending
    chats = db.query(models.Chat).order_by(models.Chat.updated_at.desc()).offset(skip).limit(limit).all()
    return chats

@app.get("/api/v1/chats/{id}/messages", response_model=List[MessageResponse])
def get_chat_messages(id: str, db: Session = Depends(get_db)):
    chat = db.query(models.Chat).filter(models.Chat.id == id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat session not found")
    # Sort by created_at ascending
    messages = db.query(models.Message).filter(models.Message.chat_id == id).order_by(models.Message.created_at.asc()).all()
    return messages

@app.post("/api/v1/chats/{id}/messages")
async def send_message(id: str, message_in: MessageCreate, db: Session = Depends(get_db)):
    chat = db.query(models.Chat).filter(models.Chat.id == id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    # Save user message
    user_message = models.Message(
        chat_id=id,
        role="user",
        content=message_in.content
    )
    db.add(user_message)
    
    # Auto-rename if title is default
    if chat.title == "New Chat" or chat.title == "":
        words = message_in.content.split()
        title = " ".join(words[:5])
        if len(words) > 5:
            title += "..."
        chat.title = title
    
    chat.updated_at = datetime.now(timezone.utc)
    db.commit()
    
    return StreamingResponse(
        generate_ai_response(id, message_in.content),
        media_type="text/event-stream"
    )

@app.delete("/api/v1/chats/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_chat(id: str, db: Session = Depends(get_db)):
    chat = db.query(models.Chat).filter(models.Chat.id == id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat session not found")
    db.delete(chat)
    db.commit()
    return None

@app.patch("/api/v1/chats/{id}", response_model=ChatResponse)
def rename_chat(id: str, chat_in: ChatRename, db: Session = Depends(get_db)):
    chat = db.query(models.Chat).filter(models.Chat.id == id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat session not found")
    chat.title = chat_in.title
    chat.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(chat)
    return chat
