from fastapi import FastAPI
from server.api.v1.endpoints import password_reset, calculate
from server.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(calculate.router, prefix="/api/v1", tags=["calculate"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Password Reset Microservice"}
