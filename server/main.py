
from fastapi import FastAPI
from server.app.api.v1.endpoints import premium, policies

app = FastAPI()

app.include_router(premium.router, prefix="/api/v1/insurance", tags=["premium"])
app.include_router(policies.router, prefix="/api/v1/policies", tags=["policies"])
