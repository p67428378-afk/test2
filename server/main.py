from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os

from server.database import Base, engine, get_db
from server.api.v1.endpoints import password_reset
from server import schemas, services

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Retail Banking FD Microservice")

# CORS Middleware
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

# Include existing routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Retail Banking Microservice"}


# --- Fixed Deposit Endpoints ---


@app.get(
    "/api/v1/fd-products",
    response_model=schemas.FDProductsListResponse,
    tags=["fixed-deposits"],
)
def list_fd_products(db: Session = Depends(get_db)):
    products = services.get_fd_products(db)
    return {"products": products}


@app.get(
    "/api/v1/accounts/{accountId}",
    response_model=schemas.AccountResponse,
    tags=["accounts"],
)
def get_account(accountId: str, db: Session = Depends(get_db)):
    account = services.get_account_details(db, accountId)
    return account


@app.post(
    "/api/v1/fds", response_model=schemas.FDCreateResponse, tags=["fixed-deposits"]
)
def create_fd(payload: schemas.FDCreateRequest, db: Session = Depends(get_db)):
    result = services.create_fd_account(
        db=db,
        product_id=payload.product_id,
        source_account_id=payload.source_account_id,
        deposit_amount=payload.deposit_amount,
        pin=payload.pin,
    )
    return result
