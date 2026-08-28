from fastapi import APIRouter
from server.routes.health import router as health_router
from server.routes.users import router as users_router
from server.routes.leaves import router as leaves_router
from server.routes.balances import router as balances_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(health_router)
api_router.include_router(users_router)
api_router.include_router(leaves_router)
api_router.include_router(balances_router)

__all__ = ["api_router"]
