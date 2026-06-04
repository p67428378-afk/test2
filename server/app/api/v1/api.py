from fastapi import APIRouter
from app.api.v1.endpoints import premiums

api_router = APIRouter()
api_router.include_router(premiums.router, prefix="/premiums", tags=["premiums"])
