from fastapi import FastAPI
from server.api.v1.endpoints import password_reset, mobile_update
from server.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(mobile_update.router, prefix="/api/v1", tags=["mobile-update"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Mobile Number Update Microservice"}
