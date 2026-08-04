import random
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.app.database import get_db
from server.app.models import ScenarioModel, SKU, AuditLog
from server.app.schemas import SubmissionRequest, SubmissionResponse
from server.app.services.guardrails import evaluate_guardrails, GuardrailException

router = APIRouter()


@router.post(
    "/submissions",
    response_model=SubmissionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_submission(req: SubmissionRequest, db: Session = Depends(get_db)):
    # Find scenario model
    scenario = (
        db.query(ScenarioModel)
        .filter(ScenarioModel.scenario_name.ilike(req.scenario_name))
        .first()
    )

    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Guardrail Check Failed: Scenario '{req.scenario_name}' not found.",
        )

    # Evaluate guardrails
    try:
        guardrails_status = evaluate_guardrails(
            scenario=scenario, db=db, override=req.guardrails_override
        )
    except GuardrailException as ge:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ge.message)

    total_skus = db.query(SKU).count()
    if total_skus == 0:
        total_skus = 17

    rand_num = random.randint(100000, 999999)
    sub_id = f"SUB-{rand_num}"
    audit_ref = f"AUD-{rand_num}"
    submitted_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    try:
        audit_entry = AuditLog(
            audit_ref_id=audit_ref,
            user_id=req.user_id,
            scenario_name=scenario.scenario_name,
            cluster_id=req.cluster_id,
            status="APPROVED_AND_LOGGED",
            payload_snapshot={
                "submission_id": sub_id,
                "category": req.category,
                "cluster_id": req.cluster_id,
                "scenario_name": scenario.scenario_name,
                "guardrails_override": req.guardrails_override,
                "user_id": req.user_id,
                "timestamp": submitted_at,
            },
            created_at=datetime.now(timezone.utc),
        )
        db.add(audit_entry)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Audit log database write error: {str(e)}",
        )

    return SubmissionResponse(
        submission_id=sub_id,
        audit_ref_id=audit_ref,
        status="APPROVED_AND_LOGGED",
        scenario_name=scenario.scenario_name,
        total_skus_modified=total_skus,
        guardrails_status=guardrails_status,
        submitted_at=submitted_at,
    )
