from fastapi import APIRouter

from .endpoints import kyc

api_router = APIRouter()
api_router.include_router(kyc.router, tags=["kyc"])
