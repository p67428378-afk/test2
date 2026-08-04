from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from server.app.database import get_db
from server.app.models import GuardrailRule

router = APIRouter()


class GuardrailItem(BaseModel):
    id: str
    rule_name: str
    metric_key: str
    operator: str
    threshold_value: float
    is_mandatory: bool = True


@router.get("", response_model=List[GuardrailItem])
@router.get("/", response_model=List[GuardrailItem])
def get_guardrails(db: Session = Depends(get_db)):
    try:
        rules = db.query(GuardrailRule).all()
        result = []

        for idx, r in enumerate(rules, start=1):
            result.append(
                GuardrailItem(
                    id=f"rule-{idx}",
                    rule_name=str(r.rule_name),
                    metric_key=str(r.metric_key),
                    operator=str(r.operator),
                    threshold_value=float(r.threshold_value),
                    is_mandatory=True,
                )
            )

        if not result:
            result = [
                GuardrailItem(
                    id="rule-1",
                    rule_name="Private Brand % Threshold",
                    metric_key="private_brand_mix_pct",
                    operator=">=",
                    threshold_value=25.0,
                    is_mandatory=True,
                ),
                GuardrailItem(
                    id="rule-2",
                    rule_name="Max Shelf Capacity",
                    metric_key="shelf_capacity_impact_pct",
                    operator="<=",
                    threshold_value=100.0,
                    is_mandatory=True,
                ),
                GuardrailItem(
                    id="rule-3",
                    rule_name="Min In-Stock Impact",
                    metric_key="in_stock_rate_pct",
                    operator=">=",
                    threshold_value=95.0,
                    is_mandatory=True,
                ),
            ]

        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving guardrails: {str(e)}"
        )
