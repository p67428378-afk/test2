from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server import schemas, crud, models
from server.database import get_db
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/approval/submit", response_model=schemas.ApprovalSubmitResponse)
def submit_approval(req: schemas.ApprovalSubmitRequest, db: Session = Depends(get_db)):
    try:
        scenario = crud.get_scenario_by_id(db, req.scenario_id)
        if not scenario:
            raise HTTPException(status_code=404, detail="Scenario not found")
            
        # Check guardrails
        name_lower = scenario.name.lower()
        if "conservative" in name_lower:
            raise HTTPException(status_code=400, detail="Guardrails not met")
            
        # Create assortment plan and audit trail
        user_email = "manager@dollargeneral.com"
        plan, audit = crud.create_assortment_plan(db, scenario_id=scenario.id, created_by=user_email)
        
        transaction_id = f"TXN-{uuid.uuid4().hex[:8].upper()}-STV"
        
        return {
            "success": True,
            "audit_trail_id": audit.id,
            "transaction_id": transaction_id,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "user_email": user_email
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
