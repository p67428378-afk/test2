from fastapi import FastAPI
from . import models, database
from .routers import product_router, application_router

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Credit Card Application API",
    description="API for managing credit card products and applications.",
    version="1.0.0",
)

app.include_router(product_router.router, prefix="/api/v1", tags=["Products"])
app.include_router(application_router.router, prefix="/api/v1", tags=["Applications"])

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the Credit Card Application API"}
