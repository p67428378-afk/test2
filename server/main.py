from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.database import engine, Base
# Import models to register them with Base.metadata
from server import models
from server.api.v1.endpoints import tasks

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Todo Application API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["tasks"])

# Safely try to include password_reset router if it exists
try:
    from server.api.v1.endpoints import password_reset
    app.include_router(password_reset.router, prefix="/api/v1", tags=["password_reset"])
except Exception:
    pass

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo Application API"}
