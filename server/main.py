"""FastAPI Main Application."""

import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.database import init_db
from server.api.v1.queue import router as queue_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Lifespan context manager for database initialization."""
    init_db()
    yield


app = FastAPI(
    title="Digital Queue System API",
    description="RESTful API for managing digital service queue tickets, real-time position checking, and status transitions.",
    version="1.0.0",
    lifespan=lifespan,
)

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

app.include_router(queue_router)


@app.get("/health", tags=["health"])
@app.get("/api/v1/queue/health", tags=["health"])
def health_check() -> dict:
    """Health check endpoint."""
    return {"status": "ok", "service": "Digital Queue System API"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)
