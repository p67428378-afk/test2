from fastapi import APIRouter
from backend.app.api.endpoints import kyc

api_router = APIRouter()
api_router.include_router(kyc.router, prefix="/kyc", tags=["kyc"])
