from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware

from server.config import ALLOWED_ORIGINS
from server.database import init_db
from server.api.v1.genres import router as genres_router
from server.api.v1.names import router as names_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables and seed data idempotently on startup
    init_db()
    yield


app = FastAPI(
    title="Character Name Generator API",
    description="RESTful API for generating genre-based unique character names",
    version="1.0.0",
    lifespan=lifespan,
)

# Custom validation exception handler to ensure standard 400 response format on validation issues
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    errors = exc.errors()
    # If quantity error or genre error in body
    for err in errors:
        loc = err.get("loc", [])
        if "quantity" in loc:
            return JSONResponse(
                status_code=400,
                content={"detail": "Quantity must be between 1 and 10."},
            )
        if "genre" in loc:
            return JSONResponse(
                status_code=400,
                content={
                    "detail": "Invalid genre selected. Allowed values: Fantasy, Sci-Fi, Cyberpunk, Mystery, Historical, General"
                },
            )
    return JSONResponse(
        status_code=400,
        content={"detail": str(errors[0].get("msg", "Invalid request body"))},
    )


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root and Health Probes
@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}


# API Routers
app.include_router(genres_router, prefix="/api/v1/genres", tags=["genres"])
app.include_router(names_router, prefix="/api/v1/names", tags=["names"])
