import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware

from server.schemas import HealthResponse
from server.services.calculator import (
    CalculatorError,
    DivisionByZeroError,
    InvalidSyntaxError,
)
from server.routers.calculator import router as calculator_router

app = FastAPI(
    title="Simple Calculator API",
    version="1.0.0",
    description="Stateless REST API for basic mathematical calculations with precision arithmetic.",
)

# CORS Middleware configuration
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(DivisionByZeroError)
async def division_by_zero_handler(request: Request, exc: DivisionByZeroError):
    return JSONResponse(
        status_code=400,
        content={"detail": exc.message, "error_code": exc.error_code},
    )


@app.exception_handler(InvalidSyntaxError)
async def invalid_syntax_handler(request: Request, exc: InvalidSyntaxError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.message, "error_code": exc.error_code},
    )


@app.exception_handler(CalculatorError)
async def calculator_error_handler(request: Request, exc: CalculatorError):
    return JSONResponse(
        status_code=400,
        content={"detail": exc.message, "error_code": exc.error_code},
    )


@app.get("/health", response_model=HealthResponse, tags=["health"])
def health_check() -> HealthResponse:
    return HealthResponse(status="healthy")


# Register routers under /api/v1
app.include_router(calculator_router, prefix="/api/v1")
