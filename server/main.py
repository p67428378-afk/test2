import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data, SessionLocal
from server.routers import auth, fines, admin_fines


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield
    # Shutdown logic (if needed)


app = FastAPI(
    title="Parking Fine Management System API",
    version="1.0.0",
    description="RESTful API for parking fine citation lookup, payment status verification, and admin CRUD management.",
    lifespan=lifespan,
)

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

app.include_router(auth.router)
app.include_router(fines.router)
app.include_router(admin_fines.router)


@app.get("/")
def root():
    return {
        "message": "Parking Fine Management System API",
        "version": "1.0.0",
        "docs_url": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "ok"}
