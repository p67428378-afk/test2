from fastapi import FastAPI
from server.api.v1.api import api_router
from server.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Vehicle Insurance Premium Calculator")

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Vehicle Insurance Premium Calculator API"}
