from fastapi import APIRouter
from server.app.api.v1.endpoints import books

api_router = APIRouter()
api_router.include_router(books.router, tags=["books"])
