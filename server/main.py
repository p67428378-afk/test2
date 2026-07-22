import os
import uuid
from typing import List, Optional, Literal
from fastapi import FastAPI, Depends, HTTPException, WebSocket, Query
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from server import crud, schemas
from server.database import Base, engine, get_db
from server.api.v1.endpoints import password_reset

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

# Include existing password reset router
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


# Task REST Endpoints
@app.get("/api/v1/tasks", response_model=List[schemas.TaskResponse])
def get_tasks(
    status: Optional[Literal["To Do", "In Progress", "Done"]] = Query(
        None, description="Filter tasks by status"
    ),
    sort: Literal["asc", "desc"] = Query(
        "desc", description="Sort order by creation date"
    ),
    db: Session = Depends(get_db),
):
    try:
        return crud.get_tasks(db, status=status, sort=sort)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error occurs while fetching tasks: {str(e)}",
        )


@app.post("/api/v1/tasks", response_model=schemas.TaskResponse, status_code=201)
async def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    try:
        db_task = crud.create_task(db, task)
        task_resp = schemas.TaskResponse.model_validate(db_task)
        message = {
            "event": "task_created",
            "data": {
                "id": str(task_resp.id),
                "title": task_resp.title,
                "status": task_resp.status,
                "assignee": task_resp.assignee,
                "created_at": task_resp.created_at.isoformat(),
                "updated_at": task_resp.updated_at.isoformat(),
            },
        }
        await manager.broadcast(message)
        return db_task
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid input data: {str(e)}")


@app.patch("/api/v1/tasks/{task_id}", response_model=schemas.TaskResponse)
async def update_task_status(
    task_id: uuid.UUID, task_update: schemas.TaskUpdate, db: Session = Depends(get_db)
):
    db_task = crud.get_task(db, task_id)
    if not db_task:
        raise HTTPException(
            status_code=404, detail="Task with the specified ID not found."
        )

    try:
        db_task = crud.update_task_status(
            db, db_task, task_update.status, task_update.assignee
        )
        task_resp = schemas.TaskResponse.model_validate(db_task)
        message = {
            "event": "task_updated",
            "data": {
                "id": str(task_resp.id),
                "title": task_resp.title,
                "status": task_resp.status,
                "assignee": task_resp.assignee,
                "created_at": task_resp.created_at.isoformat(),
                "updated_at": task_resp.updated_at.isoformat(),
            },
        }
        await manager.broadcast(message)
        return db_task
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Invalid status value provided: {str(e)}"
        )


@app.websocket("/ws/v1/worklist")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
        pass
    finally:
        manager.disconnect(websocket)


@app.get("/ws/v1/worklist", response_model=schemas.WebSocketMessage)
def websocket_info():
    """
    Establish a WebSocket connection to receive real-time task updates.
    This endpoint is a WebSocket endpoint. Connect using ws:// or wss://.
    """
    raise HTTPException(
        status_code=400,
        detail="Websocket connection expected. Please connect using ws:// or wss:// protocols.",
    )
