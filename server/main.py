import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

print("Loading database module...", flush=True)
from server.database import init_db, seed_data, SessionLocal
print("Loading routers...", flush=True)
from server.routers import profiles, matches, exchanges


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Executing lifespan startup...", flush=True)
    try:
        init_db()
        db = SessionLocal()
        try:
            seed_data(db)
        finally:
            db.close()
        print("Database initialized and seeded successfully.", flush=True)
    except Exception as e:
        print(f"Startup initialization warning: {e}", flush=True)
    yield


app = FastAPI(
    title="Skill Exchange Platform API",
    description="API for managing user skill profiles, finding reciprocal skill matches, and managing exchange requests.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(profiles.router)
app.include_router(matches.router)
app.include_router(exchanges.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Skill Exchange Platform API",
        "version": "1.0.0",
        "docs_url": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8080"))
    print(f"Starting uvicorn on 0.0.0.0:{port}...", flush=True)
    uvicorn.run("server.main:app", host="0.0.0.0", port=port)
