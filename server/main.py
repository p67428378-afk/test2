from contextlib import asynccontextmanager
from fastapi import FastAPI
from server.database import Base, engine, SessionLocal
from server.api.v1.endpoints import (
    password_reset,
    auth,
    memberships,
    visits,
    analysis,
    notifications,
)
from server import crud
from server.api.v1.endpoints.auth import hash_password


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Seed test account (idempotent)
    db = SessionLocal()
    try:
        test_user = crud.get_user_by_email(db, email="test@example.com")
        if not test_user:
            hashed_pw = hash_password("testpassword")
            user = crud.create_user(
                db, email="test@example.com", password_hash=hashed_pw
            )
            crud.create_default_notification_settings(db, user_id=user.id)
    finally:
        db.close()

    yield


app = FastAPI(lifespan=lifespan)

# Include routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(memberships.router, prefix="/api/v1", tags=["memberships"])
app.include_router(visits.router, prefix="/api/v1", tags=["visits"])
app.include_router(analysis.router, prefix="/api/v1", tags=["analysis"])
app.include_router(notifications.router, prefix="/api/v1", tags=["notifications"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Gym Membership Value Analyzer API"}
