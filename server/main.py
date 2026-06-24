"""
Module: server.main
Purpose: FastAPI application entrypoint.
Author: Backend Developer Agent
Created: 2026-06-24
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from server.api.v1.endpoints import password_reset, portfolio
from server.database import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Product Portfolio Optimizer API",
    description="Backend services for retail banking product portfolio decision-support.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(portfolio.router, prefix="/api/v1", tags=["portfolio"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Product Portfolio Optimizer API"}
