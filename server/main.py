"""
Module: main
Purpose: FastAPI application entry point with lifespan context manager and routers.
"""

from fastapi import FastAPI
from contextlib import asynccontextmanager
from server.api.v1.endpoints import password_reset, auth, items, websocket
from server.database import Base, engine, SessionLocal
from server import crud, schemas


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables
    Base.metadata.create_all(bind=engine)

    # Seed test account (idempotent)
    db = SessionLocal()
    try:
        test_user = crud.get_user_by_login_id(db, login_id="test@example.com")
        if not test_user:
            crud.create_user(
                db,
                schemas.UserRegisterRequest(
                    login_id="test@example.com",
                    mobile_number="1234567890",
                    password="testpassword",
                    security_question="What is your favorite color?",
                    security_answer="blue",
                ),
            )
    finally:
        db.close()

    yield


app = FastAPI(lifespan=lifespan)

# Include routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(items.router, prefix="/api/v1", tags=["items"])
app.include_router(websocket.router, tags=["websocket"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Bidding Website API"}
