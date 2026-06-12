from fastapi import FastAPI
from server.api.v1.endpoints import password_reset, kyc, aml, reports
from server.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="KYC and AML Compliance Engine Microservice")

# Include existing password reset router
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])

# Include new KYC & AML routers
app.include_router(kyc.router, prefix="/api/v1", tags=["kyc"])
app.include_router(aml.router, prefix="/api/v1", tags=["aml"])
app.include_router(reports.router, prefix="/api/v1", tags=["reports"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the KYC and AML Compliance Engine Microservice"}
