
from fastapi import FastAPI
from server.api.v1.endpoints import users, usage, alerts
from server.core.config import settings
from server.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(usage.router, prefix=f"{settings.API_V1_STR}/usage", tags=["usage"])
app.include_router(alerts.router, prefix=f"{settings.API_V1_STR}/alerts", tags=["alerts"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the WaterWise API"}
