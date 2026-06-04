from fastapi import FastAPI

from server.app.api.v1.endpoints import balance
from server.app.core.config import settings

app = FastAPI(title=settings.app_name)

app.include_router(balance.router, prefix="/api/v1", tags=["balance"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Account Balance Inquiry Microservice"}
