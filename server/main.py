import os
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.api.v1.endpoints.calculator import router as calculator_router

app = FastAPI(
    title="Tip Calculator API",
    description="Stateless Tip Calculator REST API for calculating tips and bill splits.",
    version="1.0.0",
)

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

app.include_router(calculator_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
