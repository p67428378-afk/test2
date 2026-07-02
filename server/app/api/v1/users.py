import time
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from server.database import get_db
from server.app.models.user import User
from server.app.schemas.user import UserCreate, UserResponse
from server.app.core.security import hash_password

router = APIRouter()

# Simple in-memory rate limiter: limit by IP address
# Allow max 5 registration requests per minute per IP
rate_limit_store: dict[str, list[float]] = {}


def check_rate_limit(request: Request) -> None:
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()

    # Clean up old entries
    if client_ip in rate_limit_store:
        timestamps = [t for t in rate_limit_store[client_ip] if now - t < 60]
        rate_limit_store[client_ip] = timestamps
    else:
        rate_limit_store[client_ip] = []

    if len(rate_limit_store[client_ip]) >= 5:
        raise HTTPException(
            status_code=429, detail="Too many requests. Please try again later."
        )

    rate_limit_store[client_ip].append(now)


@router.post("/users", response_model=UserResponse, status_code=201)
def create_user(
    user_in: UserCreate, request: Request, db: Session = Depends(get_db)
) -> Any:
    # Apply rate limiting
    check_rate_limit(request)

    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=409, detail="The email address is already registered."
        )

    # Hash password and create user
    hashed_pw = hash_password(user_in.password)
    db_user = User(
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        email=user_in.email,
        hashed_password=hashed_pw,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Set temporary attribute for Pydantic validation
    setattr(db_user, "message", "User registered successfully.")
    return UserResponse.model_validate(db_user)
