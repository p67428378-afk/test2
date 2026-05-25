from fastapi import FastAPI
from .routers import overdraft

app = FastAPI()

app.include_router(overdraft.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Overdraft Protection API"}
