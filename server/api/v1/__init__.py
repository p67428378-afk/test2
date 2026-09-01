from fastapi import APIRouter
from server.api.v1.endpoints.parking_spots import router as parking_spots_router
from server.api.v1.endpoints.realtime import router as realtime_router

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(parking_spots_router)
api_v1_router.include_router(realtime_router)

__all__ = ["api_v1_router"]
