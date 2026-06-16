
from fastapi import FastAPI, Depends
from server.config import settings
from server.database import engine
from server.models import user, weather
from server.api.v1.endpoints import users, data, forecasts, warnings, products
from server.services import auth

user.Base.metadata.create_all(bind=engine)
weather.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.include_router(auth.router, tags=["auth"], prefix=settings.API_V1_STR)
app.include_router(users.router, tags=["users"], prefix=settings.API_V1_STR)
app.include_router(data.router, tags=["data"], prefix=settings.API_V1_STR)
app.include_router(forecasts.router, tags=["forecasts"], prefix=settings.API_V1_STR)
app.include_router(warnings.router, tags=["warnings"], prefix=settings.API_V1_STR)
app.include_router(products.router, tags=["products"], prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Welcome to the METEOROS Weather Management System"}
