
from fastapi import FastAPI
from .api.v1 import policies

app = FastAPI()

app.include_router(policies.router, prefix="/api/v1/policies", tags=["policies"])

@app.get("/")
def read_root():
    return {"Hello": "World"}
