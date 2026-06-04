from fastapi import FastAPI
from server.app.api.v1 import policies, premiums
from server.app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Include routers
app.include_router(policies.router, prefix=settings.API_V1_STR)
app.include_router(premiums.router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Vehicle Insurance Premium Calculator API"}
