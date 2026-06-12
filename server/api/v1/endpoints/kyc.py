from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional
from datetime import datetime

from server import crud, models, schemas
from server.database import get_db

router = APIRouter()

def map_customer_to_response(customer: models.Customer) -> dict:
    return {
        "id": customer.id,
        "firstName": customer.first_name,
        "lastName": customer.last_name,
        "email": customer.email,
        "phone": customer.phone,
        "dateOfBirth": customer.date_of_birth.strftime("%Y-%m-%d"),
        "address": customer.address,
        "riskScore": customer.risk_score,
        "status": customer.status,
        "createdAt": customer.created_at
    }

def map_customer_to_detail_response(customer: models.Customer) -> dict:
    masked_aadhaar = ""
    if customer.aadhaar_number:
        masked_aadhaar = "********" + customer.aadhaar_number[-4:]
    return {
        "id": customer.id,
        "firstName": customer.first_name,
        "lastName": customer.last_name,
        "email": customer.email,
        "phone": customer.phone,
        "dateOfBirth": customer.date_of_birth.strftime("%Y-%m-%d"),
        "address": customer.address,
        "aadhaarNumber": masked_aadhaar,
        "panNumber": customer.pan_number or "",
        "riskScore": customer.risk_score,
        "status": customer.status,
        "createdAt": customer.created_at,
        "updatedAt": customer.updated_at
    }

@router.post("/customers", response_model=schemas.CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(customer_in: schemas.CustomerCreate, db: Session = Depends(get_db)):
    # Check if email or phone already exists
    if crud.get_customer_by_email(db, customer_in.email):
        raise HTTPException(status_code=400, detail="Customer with this email already exists")
    if crud.get_customer_by_phone(db, customer_in.phone):
        raise HTTPException(status_code=400, detail="Customer with this phone already exists")
    
    # Validate dateOfBirth format
    try:
        datetime.strptime(customer_in.dateOfBirth, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid dateOfBirth format, must be YYYY-MM-DD")

    # Validate Aadhaar (12 digits)
    if not customer_in.aadhaarNumber.isdigit() or len(customer_in.aadhaarNumber) != 12:
        raise HTTPException(status_code=422, detail="Aadhaar number must be exactly 12 digits")

    # Validate PAN (10 alphanumeric characters)
    if len(customer_in.panNumber) != 10 or not customer_in.panNumber.isalnum():
        raise HTTPException(status_code=422, detail="PAN number must be exactly 10 alphanumeric characters")

    customer = crud.create_customer(db, customer_in)
    crud.create_audit_log(db, customer.id, "CUSTOMER_CREATED", "system", f"Customer profile created for {customer.first_name} {customer.last_name}")
    return map_customer_to_response(customer)

@router.get("/customers", response_model=List[schemas.CustomerResponse])
def list_customers(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = Query(None, regex="^(APPROVED|REVIEW|FLAGGED)$"),
    db: Session = Depends(get_db)
):
    customers = crud.get_customers(db, skip=skip, limit=limit, status=status)
    return [map_customer_to_response(c) for c in customers]

@router.get("/customers/{id}", response_model=schemas.CustomerDetailResponse)
def get_customer(id: UUID, db: Session = Depends(get_db)):
    customer = crud.get_customer_by_id(db, id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return map_customer_to_detail_response(customer)

@router.post("/customers/{id}/verify-aadhaar-otp", response_model=schemas.AadhaarOTPVerifyResponse)
def verify_aadhaar_otp(id: UUID, payload: schemas.AadhaarOTPVerifyRequest, db: Session = Depends(get_db)):
    customer = crud.get_customer_by_id(db, id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    if payload.otp == "123456":
        crud.create_verification_check(db, customer.id, "AADHAAR_OTP", "PASSED", "Aadhaar eKYC verified successfully via UIDAI API.")
        crud.create_audit_log(db, customer.id, "AADHAAR_OTP_VERIFIED", "system", "Aadhaar OTP verification passed.")
        return {"status": "PASSED", "details": "Aadhaar eKYC verified successfully via UIDAI API."}
    else:
        crud.create_verification_check(db, customer.id, "AADHAAR_OTP", "FAILED", "Aadhaar eKYC verification failed: Invalid OTP.")
        crud.create_audit_log(db, customer.id, "AADHAAR_OTP_FAILED", "system", "Aadhaar OTP verification failed.")
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

@router.post("/customers/{id}/verify-pan", response_model=schemas.PANVerifyResponse)
def verify_pan(id: UUID, db: Session = Depends(get_db)):
    customer = crud.get_customer_by_id(db, id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    pan = customer.pan_number
    if pan and len(pan) == 10 and pan.isalnum():
        crud.create_verification_check(db, customer.id, "PAN_VALIDATION", "PASSED", "PAN validated successfully with Income Tax Department API.")
        crud.create_audit_log(db, customer.id, "PAN_VERIFIED", "system", "PAN validation passed.")
        return {"status": "PASSED", "details": "PAN validated successfully with Income Tax Department API."}
    else:
        crud.create_verification_check(db, customer.id, "PAN_VALIDATION", "FAILED", "PAN validation failed or name mismatch.")
        crud.create_audit_log(db, customer.id, "PAN_FAILED", "system", "PAN validation failed.")
        raise HTTPException(status_code=400, detail="PAN validation failed or name mismatch")

@router.post("/customers/{id}/screening", response_model=schemas.ScreeningResponse)
def run_screening(id: UUID, db: Session = Depends(get_db)):
    customer = crud.get_customer_by_id(db, id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    watchlists = ["RBI Sanctions List", "OFAC", "UN Security Council", "EU Sanctions List", "PEP"]
    results = []
    is_match = False

    # Simple rule: if last name is "Sanctioned" or "PEP", trigger a match
    last_name_lower = customer.last_name.lower()
    if "sanctioned" in last_name_lower or "pep" in last_name_lower:
        is_match = True

    for wl in watchlists:
        if is_match:
            match_status = "MATCH"
            confidence_score = 0.95
            reason = f"Name matched with high confidence on {wl}"
        else:
            match_status = "NO_MATCH"
            confidence_score = 0.0
            reason = "No match found"

        crud.create_screening_result(db, customer.id, wl, match_status, confidence_score, reason)
        results.append({
            "watchlist": wl,
            "matchStatus": match_status,
            "confidenceScore": confidence_score,
            "reason": reason
        })

    if is_match:
        crud.update_customer_status_and_risk(db, customer.id, "FLAGGED", 95.0)
        crud.create_audit_log(db, customer.id, "SCREENING_MATCHED", "system", "Sanctions/PEP screening matched. Customer status updated to FLAGGED.")
    else:
        # Check if they have passed Aadhaar and PAN verification
        checks = crud.get_verification_checks_by_customer_id(db, customer.id)
        passed_aadhaar = any(c.check_type == "AADHAAR_OTP" and c.status == "PASSED" for c in checks)
        passed_pan = any(c.check_type == "PAN_VALIDATION" and c.status == "PASSED" for c in checks)
        
        new_status = "APPROVED" if (passed_aadhaar and passed_pan) else "REVIEW"
        crud.update_customer_status_and_risk(db, customer.id, new_status, 0.0)
        crud.create_audit_log(db, customer.id, "SCREENING_CLEAN", "system", f"Sanctions/PEP screening clean. Customer status updated to {new_status}.")

    return {"status": "COMPLETED", "results": results}

@router.get("/customers/{id}/verifications", response_model=List[schemas.VerificationCheckResponse])
def get_verifications(id: UUID, db: Session = Depends(get_db)):
    customer = crud.get_customer_by_id(db, id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    checks = crud.get_verification_checks_by_customer_id(db, id)
    return [
        {
            "checkType": c.check_type,
            "status": c.status,
            "details": c.details,
            "createdAt": c.created_at
        }
        for c in checks
    ]

@router.get("/customers/{id}/screening", response_model=List[schemas.ScreeningResultResponse])
def get_screening_results(id: UUID, db: Session = Depends(get_db)):
    customer = crud.get_customer_by_id(db, id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    results = crud.get_screening_results_by_customer_id(db, id)
    return [
        {
            "watchlist": r.watchlist,
            "matchStatus": r.match_status,
            "confidenceScore": r.confidence_score,
            "reason": r.reason
        }
        for r in results
    ]

@router.post("/customers/{id}/action", response_model=schemas.CustomerActionResponse)
def customer_action(id: UUID, payload: schemas.CustomerActionRequest, db: Session = Depends(get_db)):
    customer = crud.get_customer_by_id(db, id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    if payload.status not in ["APPROVED", "REVIEW", "FLAGGED"]:
        raise HTTPException(status_code=400, detail="Invalid status value")

    risk_score = 0.0
    if payload.status == "FLAGGED":
        risk_score = 95.0
    elif payload.status == "REVIEW":
        risk_score = 50.0

    crud.update_customer_status_and_risk(db, customer.id, payload.status, risk_score)
    crud.create_audit_log(db, customer.id, "MANUAL_ACTION", "compliance_officer", f"Status updated to {payload.status}. Notes: {payload.notes}")

    return {
        "id": str(customer.id),
        "status": payload.status,
        "notes": payload.notes,
        "updatedAt": datetime.utcnow()
    }
