from fastapi import APIRouter
from .endpoints import applicants

api_router = APIRouter()
api_router.include_router(applicants.router, prefix="/applications", tags=["applications"])
