import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.database import init_db, seed_data, SessionLocal
from server.routers.resumes import router as resumes_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize schema and seed default data
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Quick Resume Maker API",
    description="Backend service for managing experience records and generating on-demand PDF CVs",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(resumes_router, prefix="/api/v1/resumes", tags=["resumes"])


@app.get("/health", tags=["system"])
def health_check():
    return {"status": "ok", "service": "Quick Resume Maker API"}


@app.get("/", tags=["system"])
def root():
    return {
        "message": "Welcome to Quick Resume Maker API",
        "docs_url": "/docs",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)
