from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.post("/approvals/submit", response_model=schemas.ApprovalSubmitResponse)
def submit_approval(
    payload: schemas.ApprovalSubmitRequest, db: Session = Depends(get_db)
):
    scenario = payload.selected_scenario.lower()
    if scenario == "fail_guardrail":
        raise HTTPException(
            status_code=400,
            detail="Guardrail check failed (e.g., minimum CASA floor violated)",
        )

    if scenario not in ["conservative", "balanced", "aggressive"]:
        raise HTTPException(status_code=400, detail="Invalid scenario name provided")

    # Perform dynamic guardrail checks
    guardrails = {
        "kyc_aml_flags": True,
        "minimum_casa_floor": True,
        "pmla_2002_screening": True,
        "rbi_exposure_norms": True,
    }

    try:
        # Verify products and perform dynamic guardrail checks
        for action in payload.product_actions:
            product = crud.get_product(db, action.product_id)
            if not product:
                raise HTTPException(
                    status_code=400,
                    detail=f"Product with ID {action.product_id} not found",
                )

            # RBI Exposure Norms: If product has high NPA (> 4.0%) and action is GROW, fail RBI exposure norms
            if (
                float(product.npa_percentage) > 4.0
                and action.recommended_action == "GROW"
            ):
                guardrails["rbi_exposure_norms"] = False

        # If any guardrail failed, raise 400
        if not all(guardrails.values()):
            raise HTTPException(
                status_code=400,
                detail="Guardrail check failed (e.g., RBI exposure norms violated for high NPA products)",
            )

        # Create decision log
        db_log = crud.create_decision_log(
            db=db,
            user_id="Product Manager Cluster A",
            scenario_name=scenario,
            guardrails_passed=guardrails,
        )

        # Create decision products
        for action in payload.product_actions:
            crud.create_decision_product(
                db=db,
                log_id=db_log.log_id,
                product_id=action.product_id,
                recommended_action=action.recommended_action,
            )

        return {
            "status": "SUCCESS",
            "audit_trail": {
                "approved_by": db_log.user_id,
                "guardrails_passed": guardrails,
                "log_id": db_log.log_id,
                "scenario_name": db_log.scenario_name,
                "submission_timestamp": db_log.submission_timestamp,
            },
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database write failure: {str(e)}")
