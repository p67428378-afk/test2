from fastapi import FastAPI

from server.api.v1.api import api_router

app = FastAPI()

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"message": "Welcome to the Snacks Management System"}
