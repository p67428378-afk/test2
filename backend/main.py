from fastapi import FastAPI
from .database import engine, Base, SessionLocal
from .routers import policy
from . import models
from fastapi.middleware.cors import CORSMiddleware
from datetime import date

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.on_event("startup")
async def startup_event():
    """
    Create database tables on application startup.
    This ensures tables are created when the app runs normally,
    but not when imported for testing, where test fixtures handle it.
    In a production environment, consider using Alembic for migrations.
    """
    Base.metadata.create_all(bind=engine)
    
    # Create a dummy policy for demonstration purposes
    db = SessionLocal()
    try:
        policyholder = db.query(models.Policyholder).filter(models.Policyholder.name == "Sarah J. Montgomery").first()
        if not policyholder:
            policyholder = models.Policyholder(
                id="policyholder-123",
                name="Sarah J. Montgomery",
                address="122 Sanctuary Dr., Aspen, CO 81611",
                contact_info="sarah.montgomery@example.com",
                date_of_birth=date(1988, 5, 14)
            )
            db.add(policyholder)
            db.commit()
            db.refresh(policyholder)

        policy = db.query(models.Policy).filter(models.Policy.id == "test-policy-id").first()
        if not policy:
            policy = models.Policy(
                id="test-policy-id",
                policy_number="POL-SANC-001",
                policy_type="Gold Health Plan",
                effective_date=date(2024, 1, 1),
                expiration_date=date(2025, 1, 1),
                billing_date=date(2024, 11, 1),
                status="Active",
                premium_amount=350.75,
                policyholder_id=policyholder.id
            )
            db.add(policy)
            db.commit()
            db.refresh(policy)
            
            # Add some coverage options
            coverage1 = models.CoverageOption(id="cov-1", policy_id=policy.id, coverage_type="Medical", details="Full hospital and outpatient care", start_date=date(2024,1,1), end_date=date(2025,1,1))
            coverage2 = models.CoverageOption(id="cov-2", policy_id=policy.id, coverage_type="Dental", details="Diagnostic and Major Restorative", start_date=date(2024,1,1), end_date=date(2025,1,1))
            db.add(coverage1)
            db.add(coverage2)
            db.commit()

    finally:
        db.close()


app.include_router(policy.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Policyholder Self-Service API"}
