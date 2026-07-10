from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from server.database import Base, engine
from server.api.v1.endpoints import password_reset, auth, visitors, appointments, visits

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Prison Visitor Management System")

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
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(visitors.router, prefix="/api/v1", tags=["visitors"])
app.include_router(appointments.router, prefix="/api/v1", tags=["appointments"])
app.include_router(visits.router, prefix="/api/v1", tags=["visits"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Prison Visitor Management System API"}
