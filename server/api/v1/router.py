from fastapi import APIRouter
from server.api.v1.tasks import router as tasks_router
from server.api.v1.technicians import router as technicians_router
from server.api.v1.costs import router as costs_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(tasks_router)
api_router.include_router(technicians_router)
api_router.include_router(costs_router)
