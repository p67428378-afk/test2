from fastapi import FastAPI
from server.database import Base, engine
from server.routers import fx_rates, payments, compliance, fraud, risk

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Cross-Border Payment System",
    description="Automated cross-border payment system with real-time FX, compliance, and risk controls.",
    version="1.0.0",
)

# Include routers
app.include_router(fx_rates.router, prefix="/api/v1", tags=["FX Rates"])
app.include_router(payments.router, prefix="/api/v1", tags=["Payments"])
app.include_router(compliance.router, prefix="/api/v1", tags=["Compliance"])
app.include_router(fraud.router, prefix="/api/v1", tags=["Fraud"])
app.include_router(risk.router, prefix="/api/v1", tags=["Risk"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Cross-Border Payment System API"}
