from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import os
from server.api.v1.endpoints import password_reset
from server.routes import router as api_router
from server.database import Base, engine, SessionLocal
from server.models import User
from server.crypto import get_password_hash

Base.metadata.create_all(bind=engine)


def seed_test_user():
    db = SessionLocal()
    try:
        test_email = "test@example.com"
        exists = db.query(User).filter(User.email == test_email).first()
        if not exists:
            hashed_pwd, salt = get_password_hash("testpassword")
            user = User(email=test_email, master_password_hash=hashed_pwd, salt=salt)
            db.add(user)
            db.commit()
    finally:
        db.close()


seed_test_user()

app = FastAPI(title="ShieldVault API", version="1.0.0")

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

# Include both routers!
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"message": "Welcome to ShieldVault Secure API"}
