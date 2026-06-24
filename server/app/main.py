from fastapi import FastAPI
from server.app.api.v1.api import api_router
from server.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Library Management System")

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"message": "Welcome to the Library Management System"}
