from fastapi import FastAPI
from .api.routers import portfolio

app = FastAPI()

app.include_router(portfolio.router, prefix="/api/v1")
