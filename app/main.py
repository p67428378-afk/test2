
from fastapi import FastAPI
from app.api.v1 import items, sales, customers, reports
from app.db.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Jewellery Management System",
    description="API for managing a jewellery store's inventory, sales, and customers.",
    version="1.0.0"
)

app.include_router(items.router, prefix="/api/v1/items", tags=["Items"])
app.include_router(customers.router, prefix="/api/v1/customers", tags=["Customers"])
app.include_router(sales.router, prefix="/api/v1/sales", tags=["Sales"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Jewellery Management System API"}
