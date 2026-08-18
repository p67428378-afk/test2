from fastapi import APIRouter
from server.api.v1.categories import router as categories_router
from server.api.v1.expenses import router as expenses_router

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(categories_router)
api_v1_router.include_router(expenses_router)
