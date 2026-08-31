import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db
from server.routers import cart, chocolates, orders
from server.schemas import HealthResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Exotic Chocolate Storefront & Order Management API",
    version="1.0.0",
    description="Backend API for browsing artisanal exotic chocolates, persistent cart, and temperature-controlled checkout.",
    lifespan=lifespan,
)

# Configure CORS Middleware
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(chocolates.router)
app.include_router(cart.router)
app.include_router(orders.router)


@app.get("/api/v1/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    return {"status": "ok", "database": "connected"}


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to the Exotic Chocolate Storefront API",
        "docs_url": "/docs",
        "version": "1.0.0",
    }


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("server.main:app", host=host, port=port, reload=True)
