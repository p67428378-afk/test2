from fastapi import FastAPI
from app.api.v1.endpoints import credit_application

app = FastAPI()

app.include_router(credit_application.router, prefix="/api/v1")
