from fastapi import FastAPI
from server.app.api.v1.endpoints import insurance
from server.app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(insurance.router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Welcome to SureDrive Insurance API"}
