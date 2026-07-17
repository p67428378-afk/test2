from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import os

from server.database import Base, engine
from server.api.v1.endpoints import password_reset
from server.routes import schemas, logs

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Avro Schema Registry Service", version="1.0.0")

# CORS Middleware
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

# Include routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(schemas.router, prefix="/api/v1", tags=["schemas"])
app.include_router(logs.router, prefix="/api/v1", tags=["logs"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Avro Schema Registry Service"}
