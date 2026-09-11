import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, SessionLocal, seed_data
from server.routers.auth import router as auth_router
from server.routers.contracts import router as contracts_router
from server.routers.comments import router as comments_router
from server.routers.approvals import router as approvals_router
from server.routers.reminders import router as reminders_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    init_db()
    # Seed default data
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Vendor Contract Management Portal API",
    version="1.0.0",
    description="API for contract drafting, versioning, negotiation comments, approval workflows, and renewal reminders.",
    lifespan=lifespan,
)

# CORS Middleware setup
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

# Include API Routers
app.include_router(auth_router)
app.include_router(contracts_router)
app.include_router(comments_router)
app.include_router(approvals_router)
app.include_router(reminders_router)


@app.get("/")
def root():
    return {
        "status": "ok",
        "app": "Vendor Contract Management Portal API",
        "version": "1.0.0",
    }


@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy"}
