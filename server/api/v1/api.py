from fastapi import APIRouter

from server.api.v1.endpoints import expiry, inventory, snacks

api_router = APIRouter()
api_router.include_router(inventory.router, prefix="/inventory", tags=["inventory"])
api_router.include_router(snacks.router, prefix="/snacks", tags=["snacks"])
api_router.include_router(expiry.router, prefix="/expiry-alerts", tags=["expiry"])
