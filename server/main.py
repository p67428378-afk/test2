
from fastapi import FastAPI
from server.app.api.v1.endpoints import password_reset
from server.app.core.config import settings
from server.app.db.session import engine
from server.app.models.password_reset import Base

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.include_router(password_reset.router, prefix=f"{settings.API_V1_STR}/password-reset", tags=["password-reset"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Password Reset Microservice"}

