from fastapi import FastAPI
from app.api import form16a

app = FastAPI()

app.include_router(form16a.router, prefix="/api/v1/form16a", tags=["form16a"])

@app.get("/")
def read_root():
    return {"Hello": "World"}
