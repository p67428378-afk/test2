from fastapi import FastAPI

from .api.v1.endpoints import premiums

app = FastAPI()

app.include_router(premiums.router, prefix="/api/v1", tags=["premiums"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Insurance Premium Calculator API"}
