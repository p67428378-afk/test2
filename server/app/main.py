"""
Module: main
Purpose: FastAPI application entry point and routing configuration
"""

import asyncio
from datetime import datetime, timezone, timedelta
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.app.database import Base, engine, SessionLocal
from server.app.models import User, Task
from server.app.auth import hash_password
from server.app.routers import auth, tasks, reports


async def reminder_scheduler():
    """
    Background task that runs periodically to check for upcoming deadlines
    and log automated reminders.
    """
    while True:
        try:
            db = SessionLocal()
            try:
                now = datetime.now(timezone.utc)
                reminder_window_start = now
                reminder_window_end = now + timedelta(hours=24)

                upcoming_tasks = (
                    db.query(Task)
                    .filter(
                        Task.due_date >= reminder_window_start,
                        Task.due_date <= reminder_window_end,
                        Task.status != "Done",
                    )
                    .all()
                )

                for task in upcoming_tasks:
                    print(
                        f"[AUTOMATED REMINDER] Task '{task.title}' (ID: {task.id}) is due at {task.due_date}!"
                    )
            finally:
                db.close()
        except Exception as e:
            print(f"Error in reminder scheduler: {e}")
        # Run every hour
        await asyncio.sleep(3600)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables
    Base.metadata.create_all(bind=engine)

    # Seed test accounts
    db = SessionLocal()
    try:
        # Seed member account
        test_member = db.query(User).filter(User.email == "test@example.com").first()
        if not test_member:
            test_member = User(
                email="test@example.com",
                password_hash=hash_password("testpassword"),
                role="member",
            )
            db.add(test_member)

        # Seed manager account
        test_manager = (
            db.query(User).filter(User.email == "manager@example.com").first()
        )
        if not test_manager:
            test_manager = User(
                email="manager@example.com",
                password_hash=hash_password("managerpassword"),
                role="manager",
            )
            db.add(test_manager)

        db.commit()
    finally:
        db.close()

    # Start background reminder scheduler
    scheduler_task = asyncio.create_task(reminder_scheduler())

    yield

    # Cancel background task on shutdown
    scheduler_task.cancel()


app = FastAPI(
    title="Task Management API",
    description="API for Task Management Application",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Safe with wildcard origins
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["Tasks"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Task Management API"}
