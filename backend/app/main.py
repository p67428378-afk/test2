from fastapi import FastAPI
from backend.app.database import engine, Base
from backend.app.routers import loan_router, audit_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Loan Repayment Monitoring Microservice",
    description="API for monitoring loan repayments, calculating penalties, and maintaining an audit trail.",
    version="1.0.0",
)

app.include_router(loan_router.router, prefix="/loans", tags=["loans"])
app.include_router(audit_router.router, prefix="/audit", tags=["audit"])
