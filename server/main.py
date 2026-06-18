"""
Module: server/main.py
Purpose: Main FastAPI application entry point
"""

from fastapi import FastAPI
from server.api.v1.endpoints import password_reset, sweeping
from server.database import Base, engine

app = FastAPI(title="Global Treasury Sweeping & Password Reset Microservice")


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(sweeping.router, prefix="/api/v1", tags=["sweeping"])


@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Global Treasury Sweeping & Password Reset Microservice"
    }
