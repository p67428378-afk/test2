
from fastapi import FastAPI
from server.api.v1.endpoints import kpis, skus
from server.database import engine, Base
from server.models.product import Product
from server.models.sku_performance import SkuPerformance
from server.models.kpi import Kpi

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DG Cluster Assortment Advisor",
    description="A decision-support tool for Dollar General category managers.",
    version="1.0.0"
)

app.include_router(kpis.router, prefix="/api/v1", tags=["kpis"])
app.include_router(skus.router, prefix="/api/v1", tags=["skus"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the DG Cluster Assortment Advisor API"}
