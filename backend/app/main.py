from fastapi import FastAPI
from backend.app.api import statements

app = FastAPI()

app.include_router(statements.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
