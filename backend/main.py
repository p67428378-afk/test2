from fastapi import FastAPI
from .database import engine, Base
from .routers import policy

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(policy.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Policyholder Self-Service API"}
