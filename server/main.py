import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db
from server.routers.auth import router as auth_router
from server.routers.resumes import router as resumes_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables and seed test accounts idempotently
    init_db()
    yield


app = FastAPI(
    title="Quick Resume Maker API",
    description="Backend service for Quick Resume Maker with User Authentication and Vector PDF Export",
    version="2.0.0",
    lifespan=lifespan,
)

# Configure CORS Middleware
ALLOWED_ORIGINS_ENV = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000",
)
ALLOWED_ORIGINS = [
    origin.strip() for origin in ALLOWED_ORIGINS_ENV.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

# Include Routers
app.include_router(auth_router)
app.include_router(resumes_router)


@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {"status": "ok"}


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to Quick Resume Maker API",
        "docs_url": "/docs",
        "health_url": "/api/v1/health",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)
