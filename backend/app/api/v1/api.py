
from fastapi import APIRouter
from app.api.v1.endpoints import kyc

api_router = APIRouter()
api_router.include_router(kyc.router, prefix="/kyc", tags=["kyc"])
