from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import os
from server.api.v1.endpoints import password_reset, schedule
from server.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS Middleware configuration
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

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(schedule.router, prefix="/api/v1", tags=["schedule"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Weekly Schedule and Password Reset Service"}
