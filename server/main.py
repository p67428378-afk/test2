from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from server.database import engine, Base
from server.routers import auth, credentials
from server.config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="VaultCipher API",
    description="Secure and User-Friendly Password Manager API",
    version="1.0.0",
)

# CORS Middleware configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", settings.ALLOWED_ORIGINS).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(credentials.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to VaultCipher API"}
