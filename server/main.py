
from fastapi import FastAPI
from server.api import router as api_router
from server.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Interest Payout Microservice is running."}
