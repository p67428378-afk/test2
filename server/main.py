from fastapi import FastAPI
from server.api.v1.endpoints import password_reset, reviews, config, webhook
from server.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CodeShield Security & Password Reset Microservice")

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(reviews.router, prefix="/api/v1", tags=["reviews"])
app.include_router(config.router, prefix="/api/v1", tags=["config"])
app.include_router(webhook.router, prefix="/api/v1", tags=["webhook"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the CodeShield Security & Password Reset Microservice"}
