from fastapi import FastAPI
from server.api.v1.endpoints import password_reset, dashboard, scenarios, approval
from server.database import Base, engine, seed_db

Base.metadata.create_all(bind=engine)
seed_db()

app = FastAPI()

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(dashboard.router, prefix="/api/v1", tags=["dashboard"])
app.include_router(scenarios.router, prefix="/api/v1", tags=["scenarios"])
app.include_router(approval.router, prefix="/api/v1", tags=["approval"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the DG Cluster Assortment Advisor API"}
