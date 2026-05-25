from fastapi import FastAPI
from .app.api import premium_router

app = FastAPI(title="Vehicle Insurance Premium Calculator")

app.include_router(premium_router, prefix="/api/v1/insurance")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Vehicle Insurance Premium Calculator API"}
