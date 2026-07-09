from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from contextlib import asynccontextmanager
from server.database import Base, engine, SessionLocal
from server.routers import auth, expenses
from server.auth import get_password_hash
from server.models import User


# Seed test account in lifespan startup hook
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Seed test account
    db = SessionLocal()
    try:
        test_email = "test@example.com"
        test_user = db.query(User).filter(User.email == test_email).first()
        if not test_user:
            hashed_pw = get_password_hash("testpassword")
            new_user = User(
                email=test_email, hashed_password=hashed_pw, name="Test User"
            )
            db.add(new_user)
            db.commit()
    finally:
        db.close()
    yield


app = FastAPI(
    title="Expense Tracker API",
    description="API for tracking personal expenses securely",
    version="1.0.0",
    lifespan=lifespan,
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

# Include Routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(expenses.router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"message": "Welcome to the Expense Tracker API"}
