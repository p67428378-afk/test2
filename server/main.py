import os
import uuid
import asyncio
from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    WebSocket,
    WebSocketDisconnect,
    Query,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from sqlalchemy.orm import Session
from typing import List, Optional

from server.database import Base, engine, get_db
from server.api.v1.endpoints import password_reset
from server import crud, schemas

# Ensure tables are created
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Real-Time Worklist Updater API")

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

# Include existing routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])


# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass


manager = ConnectionManager()


@app.get("/")
def read_root():
    return {"message": "Welcome to the Real-Time Worklist Updater API"}


# Task Endpoints
@app.get("/api/v1/tasks", response_model=List[schemas.TaskResponse])
def get_tasks_endpoint(
    status: Optional[str] = Query(
        None, description="Filter tasks by status ('To Do', 'In Progress', 'Done')"
    ),
    sort: str = Query(
        "desc", description="Sort order by creation date ('asc', 'desc')"
    ),
    db: Session = Depends(get_db),
):
    if status and status not in ["To Do", "In Progress", "Done"]:
        raise HTTPException(status_code=400, detail="Invalid status filter value")
    if sort not in ["asc", "desc"]:
        raise HTTPException(status_code=400, detail="Invalid sort value")
    return crud.get_tasks(db, status=status, sort=sort)


@app.post("/api/v1/tasks", response_model=schemas.TaskResponse, status_code=201)
async def create_task_endpoint(
    task_in: schemas.TaskCreate, db: Session = Depends(get_db)
):
    db_task = crud.create_task(db, task_in)
    task_resp = schemas.TaskResponse.model_validate(db_task)

    # Broadcast creation event
    await manager.broadcast({"event": "task_created", "data": task_resp.model_dump()})

    return db_task


@app.patch("/api/v1/tasks/{task_id}", response_model=schemas.TaskResponse)
async def update_task_status_endpoint(
    task_id: uuid.UUID, task_in: schemas.TaskUpdate, db: Session = Depends(get_db)
):
    if task_in.status not in ["To Do", "In Progress", "Done"]:
        raise HTTPException(status_code=400, detail="Invalid status value")

    db_task = crud.get_task(db, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    updated_task = crud.update_task_status(db, task_id, task_in.status)
    task_resp = schemas.TaskResponse.model_validate(updated_task)

    # Broadcast update event
    await manager.broadcast({"event": "task_updated", "data": task_resp.model_dump()})

    return updated_task


# WebSocket Endpoint
@app.websocket("/ws/v1/worklist")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)


# Custom OpenAPI Schema to include WebSocket endpoint
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Real-Time Worklist Updater API",
        version="1.0.0",
        description="API for Real-Time Worklist Updater",
        routes=app.routes,
    )
    # Add the WebSocket endpoint to paths
    openapi_schema["paths"]["/ws/v1/worklist"] = {
        "get": {
            "summary": "Establish a WebSocket connection to receive real-time task updates.",
            "description": "Establish a WebSocket connection to receive real-time task updates.",
            "responses": {"101": {"description": "Switching Protocols to WebSocket"}},
        }
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi
