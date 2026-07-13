from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import os
from server.database import engine, Base
from server.routes import auth, credentials, passwords
from server.crypto import hash_master_password
from server.models import User
from server.database import SessionLocal

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LockBox Password Manager API",
    description="Secure RESTful API for LockBox Password Manager",
    version="1.0.0",
)

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


# Seed test account in startup hook (idempotent)
@app.on_event("startup")
def seed_test_user():
    db = SessionLocal()
    try:
        test_user = db.query(User).filter(User.username == "test@example.com").first()
        if not test_user:
            hashed_pw = hash_master_password("testpassword")
            new_user = User(username="test@example.com", master_password_hash=hashed_pw)
            db.add(new_user)
            db.commit()
    finally:
        db.close()


# Include Routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(credentials.router, prefix="/api/v1")
app.include_router(passwords.router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"message": "Welcome to LockBox Password Manager API"}
