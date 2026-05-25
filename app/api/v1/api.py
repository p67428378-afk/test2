from fastapi import APIRouter

from app.api.v1.endpoints import application

api_router = APIRouter()
api_router.include_router(application.router, prefix="/applications", tags=["applications"])
