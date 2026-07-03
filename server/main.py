from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from server.database import engine
from server.models import Base
from server.routers import attendance, reports

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Attendance Management System API", version="1.0.0")

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
app.include_router(attendance.router, prefix="/api/v1", tags=["attendance"])
app.include_router(reports.router, prefix="/api/v1", tags=["reports"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Attendance Management System API"}
