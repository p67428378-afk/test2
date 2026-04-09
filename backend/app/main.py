from fastapi import FastAPI
from backend.app.api.v1.endpoints import premium

app = FastAPI()

app.include_router(premium.router, prefix="/api/v1", tags=["premium"])

@app.get("/")
def read_root():
    return {"Hello": "World"}
