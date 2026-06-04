from fastapi import APIRouter
from server.api.v1.endpoints import insurance

api_router = APIRouter()
api_router.include_router(insurance.router, tags=["insurance"])
