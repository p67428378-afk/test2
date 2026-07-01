from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import os
from server.api.v1.endpoints import password_reset, assortment
from server.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

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
app.include_router(assortment.router, prefix="/api/v1", tags=["assortment"])


@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Password Reset and Assortment Advisor Microservice"
    }
