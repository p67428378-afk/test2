from fastapi import APIRouter
from server.api.v1.endpoints.certificates import router as certificates_router

api_router = APIRouter()
api_router.include_router(certificates_router, prefix="/certificates", tags=["certificates"])
