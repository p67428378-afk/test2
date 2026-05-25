from fastapi import APIRouter

from app.api.v1.endpoints import policies

api_router = APIRouter()
api_router.include_router(policies.router, prefix="/policies", tags=["policies"])
