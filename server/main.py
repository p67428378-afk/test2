
from fastapi import FastAPI
from server.core.config import settings
from server.api.v1.endpoints import users, usage, alerts
from server.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.include_router(users.router, prefix=settings.API_V1_STR, tags=["users"])
app.include_router(usage.router, prefix=settings.API_V1_STR, tags=["usage"])
app.include_router(alerts.router, prefix=settings.API_V1_STR, tags=["alerts"])
