from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from server.app.config import settings
from server.app.database import (
    init_db,
    seed_data,
    SessionLocal,
    get_db,
    get_password_hash,
    verify_password,
)
from server.app.models.user import User
from server.app.schemas import UserCreate, UserResponse, Token
from server.app.routers import create_access_token, get_current_user
from server.app.routers.films import router as films_router
from server.app.routers.watchlist import router as watchlist_router
from server.app.routers.ratings import router as ratings_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database and seed data on startup
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(title="CineList Watchlist App API", version="1.0.0", lifespan=lifespan)

# CORS Middleware
ALLOWED_ORIGINS = settings.ALLOWED_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(films_router, prefix="/api/v1")
app.include_router(watchlist_router, prefix="/api/v1")
app.include_router(ratings_router, prefix="/api/v1")


# Auth Endpoints
@app.post(
    "/api/v1/auth/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    hashed_pwd = get_password_hash(payload.password)
    user = User(email=payload.email, hashed_password=hashed_pwd)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/api/v1/auth/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/api/v1/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@app.get("/")
def root():
    return {"message": "Welcome to CineList Watchlist App API"}
