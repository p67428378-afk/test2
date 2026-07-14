from fastapi import FastAPI, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid

from server.api.v1.endpoints import password_reset
from server.routes import claims
from server.database import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Instant Vehicle Damage Estimate API")

# CORS Middleware configuration
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(claims.router, prefix="/api/v1", tags=["claims"])


# Add aliases/redirects to match the exact paths in WorkSpec
@app.post("/api/v1/dispatch/request_tow", tags=["dispatch"], include_in_schema=True)
def request_tow_alias(
    request: claims.DispatchRequest,
    db=Depends(get_db),
    idempotency_key=Header(None, alias="Idempotency-Key"),
):
    return claims.request_tow_dispatch(request, idempotency_key, db)


@app.get(
    "/api/v1/dispatch/{dispatch_id}/status", tags=["dispatch"], include_in_schema=True
)
def get_dispatch_status_alias(dispatch_id: uuid.UUID, db=Depends(get_db)):
    return claims.get_dispatch_status(dispatch_id, db)


@app.post(
    "/api/v1/dispatch/{dispatch_id}/cancel", tags=["dispatch"], include_in_schema=True
)
def cancel_tow_dispatch_alias(dispatch_id: uuid.UUID, db=Depends(get_db)):
    return claims.cancel_tow_dispatch(dispatch_id, db)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Instant Vehicle Damage Estimate API"}
