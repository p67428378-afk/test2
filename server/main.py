from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import os
from server.database import Base, engine
from server.routes import auth, passwords

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Secure Password Manager API", version="1.0.0")

# CORS Middleware configuration
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
app.include_router(auth.router, prefix="/api/v1/users", tags=["Authentication"])
app.include_router(passwords.router, prefix="/api/v1/passwords", tags=["Passwords"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Secure Password Manager API"}
