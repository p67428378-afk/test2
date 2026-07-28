from typing import Optional
from datetime import datetime, timedelta, timezone
from contextlib import asynccontextmanager
from uuid import UUID

from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    status,
    WebSocket,
    WebSocketDisconnect,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from server import schemas, crud, models
from server.database import SessionLocal, init_db, seed_data, get_db, verify_password
from server.config import settings
from server.api.v1.endpoints import password_reset


# Lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(title="Worklist Updater API", version="1.0.0", lifespan=lifespan)

# CORS Middleware
ALLOWED_ORIGINS = settings.ALLOWED_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include existing password reset router
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])

# JWT Authentication Setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user


# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

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


# Auth Endpoints
@app.post(
    "/api/v1/auth/register",
    response_model=schemas.UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(user_in: schemas.UserRegisterRequest, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user_in.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )
    return crud.create_user(db, user_in)


@app.post("/api/v1/auth/login", response_model=schemas.LoginResponse)
def login_user(login_in: schemas.UserLoginRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=login_in.email)
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": user}


# Worklist Endpoints
@app.get("/api/v1/worklist", response_model=schemas.WorklistListResponse)
def list_worklist_items(
    status_filter: Optional[str] = None,
    sort_by: str = "created_at",
    order: str = "desc",
    skip: int = 0,
    limit: int = 20,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # RBAC: Admin can see all items, regular user can only see their own items
    user_id_filter = None if current_user.role == "admin" else current_user.id

    items, total = crud.get_worklist_items(
        db,
        user_id=user_id_filter,
        status=status_filter,
        sort_by=sort_by,
        order=order,
        skip=skip,
        limit=limit,
    )
    return {"items": items, "total": total}


@app.post(
    "/api/v1/worklist",
    response_model=schemas.WorklistItemResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_item(
    item_in: schemas.WorklistItemCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_item = crud.create_worklist_item(db, item_in, current_user.id)

    # Broadcast real-time update
    await manager.broadcast(
        {
            "event": "item_created",
            "data": jsonable_encoder(
                schemas.WorklistItemResponse.model_validate(db_item)
            ),
        }
    )

    return db_item


@app.put("/api/v1/worklist/{item_id}", response_model=schemas.WorklistItemResponse)
async def update_item(
    item_id: UUID,
    item_in: schemas.WorklistItemUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_item = crud.get_worklist_item(db, item_id)
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )

    # RBAC: Only owner or admin can update
    if current_user.role != "admin" and db_item.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden (cannot modify other users' items unless admin)",
        )

    updated_item = crud.update_worklist_item(db, db_item, item_in)

    # Broadcast real-time update
    await manager.broadcast(
        {
            "event": "item_updated",
            "data": jsonable_encoder(
                schemas.WorklistItemResponse.model_validate(updated_item)
            ),
        }
    )

    return updated_item


@app.delete("/api/v1/worklist/{item_id}", status_code=status.HTTP_200_OK)
async def delete_item(
    item_id: UUID,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_item = crud.get_worklist_item(db, item_id)
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )

    # RBAC: Only owner or admin can delete
    if current_user.role != "admin" and db_item.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden (cannot delete other users' items unless admin)",
        )

    item_data = jsonable_encoder(schemas.WorklistItemResponse.model_validate(db_item))
    crud.delete_worklist_item(db, db_item)

    # Broadcast real-time update
    await manager.broadcast({"event": "item_deleted", "data": item_data})

    return {"message": "Item deleted successfully"}


# WebSocket Endpoint
@app.websocket("/ws/v1/worklist")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and listen for any client messages (though we mostly broadcast)
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


# HTTP GET endpoint for WebSocket info (to satisfy OpenAPI schema check)
@app.get("/ws/v1/worklist", response_model=dict)
def websocket_info():
    """
    WebSocket endpoint for real-time updates.
    Connect using ws:// or wss:// protocol.
    """
    return {"message": "Use WebSocket protocol to connect to this endpoint."}
