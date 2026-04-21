from fastapi import FastAPI
from app.api import loan_router

app = FastAPI()

app.include_router(loan_router.router, prefix="/api/v1")
