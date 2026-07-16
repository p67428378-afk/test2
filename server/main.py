from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from server.database import Base, engine
from server.routers import auth, properties, messages
from server.auth import get_password_hash
from server.models import User
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager

# Create tables
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Seed test account if it doesn't exist
    from server.database import SessionLocal

    db: Session = SessionLocal()
    try:
        test_user = db.query(User).filter(User.email == "test@example.com").first()
        if not test_user:
            hashed_pw = get_password_hash("testpassword")
            db_user = User(
                email="test@example.com",
                hashed_password=hashed_pw,
                role="buyer",
                full_name="Test Buyer",
                phone="123-456-7890",
            )
            db.add(db_user)
            db.commit()
    finally:
        db.close()
    yield


app = FastAPI(
    title="BrokerHaven API",
    description="Comprehensive Real Estate Platform for Brokers and Buyers",
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

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(properties.router, prefix="/api/v1")
app.include_router(messages.router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"message": "Welcome to BrokerHaven API"}
