from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.app.database import get_db
from server.app.models import ScenarioModel
from server.app.schemas import ScenarioListResponse, ScenarioResponse, ActionSummary

router = APIRouter()

ACTION_SUMMARIES = {
    "Conservative": ActionSummary(GROW=2, MAINTAIN=12, SWAP=1, REDUCE=1),
    "Balanced": ActionSummary(GROW=4, MAINTAIN=10, SWAP=2, REDUCE=1),
    "Aggressive": ActionSummary(GROW=6, MAINTAIN=8, SWAP=3, REDUCE=2),
}


@router.get("/scenarios", response_model=ScenarioListResponse)
def get_scenarios(db: Session = Depends(get_db)):
    try:
        models = db.query(ScenarioModel).all()
        scenario_responses = []

        for idx, m in enumerate(models, start=1):
            sc_name = str(m.scenario_name)
            action_sum = ACTION_SUMMARIES.get(
                sc_name, ActionSummary(GROW=4, MAINTAIN=10, SWAP=2, REDUCE=1)
            )
            scenario_responses.append(
                ScenarioResponse(
                    scenario_id=f"SCEN-0{idx}",
                    name=sc_name,
                    scenario_name=sc_name,
                    projected_sales_lift_pct=float(m.projected_sales_lift_pct),
                    projected_private_brand_pct=float(m.projected_private_brand_pct),
                    private_brand_mix_pct=float(m.projected_private_brand_pct),
                    shelf_capacity_impact_pct=float(m.shelf_capacity_impact_pct),
                    action_summary=action_sum,
                    actions_breakdown=action_sum,
                )
            )

        return ScenarioListResponse(
            cluster_id="STV-CLUSTER-01",
            default_scenario="Balanced",
            scenarios=scenario_responses,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch scenario models: {str(e)}"
        )
