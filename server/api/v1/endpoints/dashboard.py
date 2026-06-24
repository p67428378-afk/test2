from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server import crud, models, schemas
from server.database import get_db
import uuid
from datetime import datetime, timezone

router = APIRouter()


@router.get("/dashboard", response_model=schemas.DashboardResponse)
def get_dashboard_data(db: Session = Depends(get_db)):
    """
    Fetches all data required for the main dashboard view, including KPIs, products, and scenarios.
    """
    # Ensure initial data is seeded
    crud.seed_data = crud.seed_initial_data(db)

    # Fetch products and scenarios
    products = crud.get_products(db)
    scenarios = crud.get_scenarios(db)

    # Define static KPIs
    kpis = schemas.KPIHeader(
        availability_rate=99.85,
        business_per_branch="₹42.5 Cr",
        capacity_utilization=78.2,
        casa_ratio=38.4,
    )

    # Map scenarios to include dynamic guardrails
    scenarios_response = []
    for s in scenarios:
        # Determine guardrails based on scenario ID
        if s.id == "aggressive":
            guardrails = schemas.GuardrailsResponse(
                kyc_aml_flags=True,
                min_casa_floor=False,
                pmla_2002_screening=True,
                rbi_exposure_norms=False,
            )
        else:
            guardrails = schemas.GuardrailsResponse(
                kyc_aml_flags=True,
                min_casa_floor=True,
                pmla_2002_screening=True,
                rbi_exposure_norms=True,
            )

        product_actions = [
            schemas.ProductActionResponse(product_id=pa.product_id, action=pa.action)
            for pa in s.product_actions
        ]

        scenarios_response.append(
            schemas.ScenarioResponse(
                id=s.id,
                name=s.name,
                description=s.description,
                casa_growth=float(s.casa_growth),
                npa_risk=s.npa_risk,
                roa_impact=float(s.roa_impact),
                guardrails=guardrails,
                product_actions=product_actions,
            )
        )

    return schemas.DashboardResponse(
        kpis=kpis,
        products=[
            schemas.ProductResponse(
                id=p.id,
                name=p.name,
                category=p.category,
                aum_contribution=float(p.aum_contribution),
                npa_percentage=float(p.npa_percentage)
                if p.npa_percentage is not None
                else None,
                status=p.status,
            )
            for p in products
        ],
        scenarios=scenarios_response,
    )


@router.post("/proposals", response_model=schemas.ProposalResponse, status_code=201)
def submit_proposal(
    payload: schemas.ProposalCreateRequest, db: Session = Depends(get_db)
):
    """
    Submits a product promotion proposal for approval.
    """
    # Validate scenario_id
    scenario = crud.get_scenario_by_id(db, payload.scenario_id)
    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid scenario_id: {payload.scenario_id}",
        )

    # Validate product_ids
    for action in payload.proposed_actions:
        product = (
            db.query(models.Product)
            .filter(models.Product.id == action.product_id)
            .first()
        )
        if not product:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid product_id: {action.product_id}",
            )

    # Determine guardrails passed
    guardrails_passed = True
    if payload.scenario_id == "aggressive":
        guardrails_passed = False

    # Generate audit trail
    timestamp_str = datetime.now(timezone.utc).isoformat()
    audit_id = f"TXN-{uuid.uuid4().hex[:5].upper()}-RURAL"
    submitted_by = "Sarah Jenkins"
    routed_to = "John Doe (Zonal Head)"

    guardrails_status = (
        "passed" if guardrails_passed else "failed (CASA Floor, RBI Exposure Norms)"
    )
    audit_trail = (
        f"Proposal submitted by {submitted_by} to Zonal Head ({routed_to}). "
        f"Scenario: {scenario.name}. Guardrails status: {guardrails_status}. "
        f"Timestamp: {timestamp_str}. Audit ID: {audit_id}"
    )

    # Create proposal
    db_proposal = crud.create_proposal(
        db=db,
        scenario_id=payload.scenario_id,
        submitted_by=submitted_by,
        routed_to=routed_to,
        guardrails_passed=guardrails_passed,
        audit_trail=audit_trail,
    )

    try:
        db.commit()
        db.refresh(db_proposal)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database write failed: {str(e)}",
        )

    return schemas.ProposalResponse(
        id=db_proposal.id,
        scenario_id=db_proposal.scenario_id,
        status=db_proposal.status,
        submitted_by=db_proposal.submitted_by,
        routed_to=db_proposal.routed_to,
        timestamp=db_proposal.timestamp.isoformat(),
        guardrails_passed=db_proposal.guardrails_passed,
        audit_trail=db_proposal.audit_trail,
    )
