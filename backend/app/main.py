from fastapi import FastAPI

from app.api.v1.endpoints import accounts
from app.core.config import settings

app = FastAPI()

app.include_router(accounts.router, prefix=f"{settings.API_V1_STR}/accounts", tags=["accounts"])
