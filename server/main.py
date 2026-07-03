# server/main.py
from fastapi import FastAPI
from contextlib import asynccontextmanager
from server.database import Base, engine, SessionLocal
from server.routers import events, admin
from server import crud
import hashlib


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Seed admin user if not exists
    db = SessionLocal()
    try:
        admin_user = crud.get_admin_by_username(db, "admin")
        if not admin_user:
            hashed_pw = hashlib.sha256("adminpassword".encode("utf-8")).hexdigest()
            crud.create_admin(db, "admin", hashed_pw)

        # Seed test account as required by Constitution
        test_user = crud.get_admin_by_username(db, "test@example.com")
        if not test_user:
            hashed_test_pw = hashlib.sha256("testpassword".encode("utf-8")).hexdigest()
            crud.create_admin(db, "test@example.com", hashed_test_pw)
    finally:
        db.close()

    yield


app = FastAPI(
    title="Community Event Platform API",
    description="API for discovering events, registering, and managing events.",
    version="1.0.0",
    lifespan=lifespan,
)

# Include routers
app.include_router(events.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"message": "Welcome to the Community Event Platform API"}
