from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.api.v1.endpoints import password_reset, users, roundups, milestones
from server.database import Base, engine
import os

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ApexInvest Micro-investing API")

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
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(users.router, prefix="/api/v1")
app.include_router(roundups.router, prefix="/api/v1")
app.include_router(milestones.router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"message": "Welcome to the ApexInvest Micro-investing API"}
