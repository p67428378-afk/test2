from fastapi import FastAPI
from backend.routers import mobile_update

app = FastAPI()

app.include_router(mobile_update.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Mobile Number Update Service"}
