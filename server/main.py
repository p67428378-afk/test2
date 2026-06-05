
from fastapi import FastAPI
from server.api.v1.endpoints import premium
from server.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Vehicle Insurance Premium Calculator")

app.include_router(premium.router, prefix="/api/v1/insurance", tags=["premium"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Vehicle Insurance Premium Calculator API"}
