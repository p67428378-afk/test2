from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, status
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
import os
from jose import jwt, JWTError

from server.api.v1.endpoints import password_reset
from server.database import init_db, seed_data, SessionLocal, get_db
from server.router import router as worklist_router
from server.websocket import manager
from server.config import settings
from server import models

# Initialize database and seed data
init_db()
db = SessionLocal()
try:
    seed_data(db)
finally:
    db.close()

app = FastAPI(title="WorkSync API", version="1.0.0")

# CORS Middleware
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

# Include routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(worklist_router, prefix="/api/v1", tags=["worklist"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the WorkSync API"}


# Dummy GET endpoint for WebSocket to satisfy OpenAPI schema checks
@app.get("/ws/worklist")
def websocket_description():
    """
    Establishes a WebSocket connection for real-time updates.
    """
    return {"message": "Use WebSocket protocol (ws://) to connect to this endpoint."}


# WebSocket Endpoint
@app.websocket("/ws/worklist")
async def websocket_endpoint(
    websocket: WebSocket, token: Optional[str] = None, db: Session = Depends(get_db)
):
    if not token:
        # Try to get token from query params if not passed directly
        token = websocket.query_params.get("token")

    if not token:
        await websocket.accept()
        await websocket.close(
            code=status.WS_1008_POLICY_VIOLATION, reason="Token missing"
        )
        return

    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        username: str = payload.get("sub")
        if username is None:
            await websocket.accept()
            await websocket.close(
                code=status.WS_1008_POLICY_VIOLATION, reason="Invalid token payload"
            )
            return
    except JWTError:
        await websocket.accept()
        await websocket.close(
            code=status.WS_1008_POLICY_VIOLATION, reason="Token decode error"
        )
        return

    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        await websocket.accept()
        await websocket.close(
            code=status.WS_1008_POLICY_VIOLATION, reason="User not found"
        )
        return

    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and listen for any client messages
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
