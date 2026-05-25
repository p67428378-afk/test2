from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend import models, schemas
from backend.database import SessionLocal, engine

# models.Base.metadata.create_all(bind=engine) # Removed this line

app = FastAPI()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/", response_model=str)
async def root():
    return "Customer Risk Profiling Microservice"

# Placeholder for risk assessment logic
@app.post("/api/v1/risk-assessments", response_model=schemas.RiskAssessmentResponse)
async def create_risk_assessment(request: schemas.RiskAssessmentRequest, db: Session = Depends(get_db)):
    # This is a placeholder. Actual risk assessment logic will go here.
    # For now, let's just return a dummy response.
    # In a real scenario, this would involve:
    # 1. Data validation and sanitization (partially handled by Pydantic)
    # 2. Calling external risk signal providers
    # 3. Invoking the scoring model engine
    # 4. Storing results in the database
    # 5. Generating an audit trail event

    # Dummy risk calculation
    risk_score = 500 # Example score
    risk_status = "MEDIUM_RISK" # Example status
    if request.credit_history.get("score", 0) < 400:
        risk_status = "HIGH_RISK"
    elif request.demographics.get("income", 0) > 100000 and request.transaction_patterns.get("frequency", 0) > 10:
        risk_status = "LOW_RISK"

    # Dummy model version and audit ref
    model_version = "v1.0.0"
    audit_log_ref = "dummy_audit_ref_123"

    # Create a dummy RiskAssessmentResult
    db_risk_assessment = models.RiskAssessmentResult(
        customer_id=request.customer_id,
        risk_score=risk_score,
        risk_status=risk_status,
        model_version=model_version,
        audit_log_ref=audit_log_ref
    )
    db.add(db_risk_assessment)
    db.commit()
    db.refresh(db_risk_assessment)

    return schemas.RiskAssessmentResponse(
        assessment_id=db_risk_assessment.assessment_id,
        customer_id=db_risk_assessment.customer_id,
        risk_status=db_risk_assessment.risk_status,
        risk_score=db_risk_assessment.risk_score,
        model_version=db_risk_assessment.model_version,
        assessment_timestamp=db_risk_assessment.assessment_timestamp,
        audit_log_ref=db_risk_assessment.audit_log_ref
    )

@app.get("/api/v1/risk-assessments/{assessment_id}", response_model=schemas.RiskAssessmentResponse)
async def get_risk_assessment(assessment_id: str, db: Session = Depends(get_db)):
    db_assessment = db.query(models.RiskAssessmentResult).filter(models.RiskAssessmentResult.assessment_id == assessment_id).first()
    if db_assessment is None:
        raise HTTPException(status_code=404, detail="Risk assessment not found")
    return db_assessment
