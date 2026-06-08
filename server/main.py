
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from server.api.v1.endpoints import password_reset, dashboard
from server.database import Base, engine
from server.core.config import settings
from server.scheduler import start_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start scheduler only if not in testing mode
    if not settings.TESTING:
        app.state.scheduler_task = asyncio.create_task(start_scheduler())
    yield
    # Clean up scheduler task if it exists
    if hasattr(app.state, "scheduler_task"):
        app.state.scheduler_task.cancel()

Base.metadata.create_all(bind=engine)

app = FastAPI(lifespan=lifespan)

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(dashboard.router, prefix="/api/v1", tags=["dashboard"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Password Reset Microservice"}
