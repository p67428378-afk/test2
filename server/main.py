import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from server.config import settings
from server.database import init_db, get_db
from server.models import User
from server.schemas import UserLogin, Token, UserOut, UserCreate
from server.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
)
from server.routers.notes import router as notes_router
from server.routers.reviews import router as reviews_router
from server.routers.search import router as search_router
from server.routers.tags import router as tags_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB and seed data on startup
    init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME, openapi_url="/openapi.json", lifespan=lifespan
)

# Set up CORS middleware
allowed_origins = os.getenv("ALLOWED_ORIGINS", settings.ALLOWED_ORIGINS).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(notes_router, prefix=settings.API_V1_STR)
app.include_router(reviews_router, prefix=settings.API_V1_STR)
app.include_router(search_router, prefix=settings.API_V1_STR)
app.include_router(tags_router, prefix=settings.API_V1_STR)


# Health check endpoint
@app.get("/health")
@app.get(f"{settings.API_V1_STR}/health")
def health_check():
    return {"status": "healthy", "project": settings.PROJECT_NAME}


# Authentication Endpoints
@app.post(f"{settings.API_V1_STR}/auth/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserOut.model_validate(user),
    )


@app.post(
    f"{settings.API_V1_STR}/auth/register",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists.",
        )
    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role or "ROLE_EMPLOYEE",
        is_active=True,
        is_verified=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.get(f"{settings.API_V1_STR}/auth/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
