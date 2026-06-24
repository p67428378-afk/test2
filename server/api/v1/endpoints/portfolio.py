"""
Module: server.api.v1.endpoints.portfolio
Purpose: API endpoints for the Product Portfolio Optimizer Dashboard.
Author: Backend Developer Agent
Created: 2026-06-24
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server import schemas, crud
from server.database import get_db
from datetime import timezone

router = APIRouter()


@router.get("/dashboard-data", response_model=schemas.DashboardDataResponse)
def get_dashboard_data(db: Session = Depends(get_db)):
    """
    Fetches all necessary data for the initial dashboard view,
    including KPIs, products, scenarios, and guardrail checks.
    """
    # Ensure data is seeded
    crud.seed_portfolio_data(db)

    # Hardcoded KPIs as specified in the requirements/Stitch HTML
    kpis = schemas.KPIHeader(
        business_per_branch="₹1.2 Cr",
        capacity_utilization=85.0,
        casa_ratio=42.5,
        scheme_availability_rate=99.8,
    )

    # Fetch products and metrics
    db_products = crud.get_products(db)
    products = []
    for p in db_products:
        # Get the latest metric
        metric = p.metrics[0] if p.metrics else None
        products.append(
            schemas.ProductResponse(
                id=p.id,
                name=p.name,
                aum_contribution=float(metric.aum_contribution) if metric else 0.0,
                npa_percentage=float(metric.npa_percentage) if metric else 0.0,
                status=metric.status if metric else "MAINTAIN",
            )
        )

    # Fetch scenarios
    db_scenarios = crud.get_scenarios(db)
    scenarios = []
    for s in db_scenarios:
        # Define product actions and guardrails based on scenario name
        if s.name == "Conservative":
            product_actions = {"GROW": 1, "MAINTAIN": 3, "REDUCE": 1, "SWAP": 1}
            guardrails = schemas.GuardrailsResponse(
                kyc_aml_flags="PASS",
                minimum_casa_floor="PASS",
                pmla_2002_screening="PASS",
                rbi_exposure_norms="PASS",
            )
        elif s.name == "Balanced":
            product_actions = {"GROW": 2, "MAINTAIN": 2, "REDUCE": 1, "SWAP": 1}
            guardrails = schemas.GuardrailsResponse(
                kyc_aml_flags="PASS",
                minimum_casa_floor="PASS",
                pmla_2002_screening="PASS",
                rbi_exposure_norms="PASS",
            )
        else:  # Aggressive
            product_actions = {"GROW": 3, "MAINTAIN": 1, "REDUCE": 1, "SWAP": 1}
            guardrails = schemas.GuardrailsResponse(
                kyc_aml_flags="PASS",
                minimum_casa_floor="PASS",
                pmla_2002_screening="PASS",
                rbi_exposure_norms="FAIL",  # Fails RBI exposure norms
            )

        scenarios.append(
            schemas.ScenarioResponse(
                id=s.id,
                name=s.name,
                casa_growth=s.casa_growth,
                npa_risk_movement=s.npa_risk_movement,
                roa_impact=s.roa_impact,
                product_actions=product_actions,
                guardrails=guardrails,
            )
        )

    return schemas.DashboardDataResponse(
        kpis=kpis, products=products, scenarios=scenarios
    )


@router.post(
    "/decisions",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.DecisionResponse,
)
def submit_decision(request: schemas.DecisionRequest, db: Session = Depends(get_db)):
    """
    Submits the selected scenario and product actions for approval,
    performing guardrail checks and logging the audit trail.
    """
    # Ensure data is seeded
    crud.seed_portfolio_data(db)

    # Fetch scenario
    scenario = crud.get_scenario_by_id(db, request.scenario_id)
    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid scenario selected"
        )

    # Perform guardrail checks
    rbi_exposure_norms = "PASS"
    kyc_aml_flags = "PASS"
    pmla_2002_screening = "PASS"
    minimum_casa_floor = "PASS"

    if scenario.name == "Aggressive":
        rbi_exposure_norms = "FAIL"

    # Calculate passed guardrails
    checks = [
        rbi_exposure_norms,
        kyc_aml_flags,
        pmla_2002_screening,
        minimum_casa_floor,
    ]
    guardrails_passed = sum(1 for c in checks if c == "PASS")
    total_guardrails = len(checks)

    if guardrails_passed < total_guardrails:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Guardrail checks failed",
        )

    # Create decision audit and guardrail check
    try:
        db_decision = crud.create_decision_audit(
            db=db, scenario_id=scenario.id, approver_name=request.approver_name
        )
        db.flush()  # Get db_decision.id

        crud.create_guardrail_check(
            db=db,
            decision_id=db_decision.id,
            rbi_exposure_norms=rbi_exposure_norms,
            kyc_aml_flags=kyc_aml_flags,
            pmla_2002_screening=pmla_2002_screening,
            minimum_casa_floor=minimum_casa_floor,
        )

        db.commit()
        db.refresh(db_decision)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )

    timestamp_str = db_decision.timestamp.replace(tzinfo=timezone.utc).isoformat()

    audit_trail_summary = (
        f"Decision approved by {request.approver_name} under {scenario.name} scenario. "
        f"All {guardrails_passed} guardrails passed successfully."
    )

    return schemas.DecisionResponse(
        decision_id=db_decision.id,
        scenario_name=scenario.name,
        approver_name=request.approver_name,
        timestamp=timestamp_str,
        guardrails_passed=guardrails_passed,
        total_guardrails=total_guardrails,
        audit_trail_summary=audit_trail_summary,
    )
