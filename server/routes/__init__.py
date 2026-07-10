from fastapi import APIRouter
from server.routes import users, credentials, vault

router = APIRouter()

router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(credentials.router, prefix="/credentials", tags=["credentials"])
router.include_router(vault.router, tags=["vault"])
