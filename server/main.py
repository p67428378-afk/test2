import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data, get_db
from server.routers import auth, expenses, categories, budgets, reports


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables and seed test data
    init_db()
    db = next(get_db())
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Expense Tracker API",
    description="Core Expense Management, Monthly Budgets, Analytics, and Reporting API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(expenses.router, prefix="/api/v1/expenses", tags=["expenses"])
app.include_router(categories.router, prefix="/api/v1/categories", tags=["categories"])
app.include_router(budgets.router, prefix="/api/v1/budgets", tags=["budgets"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok", "service": "expense-tracker-api"}
