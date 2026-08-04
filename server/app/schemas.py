from typing import List
from pydantic import BaseModel


class KPISummaryResponse(BaseModel):
    cluster_id: str = "STV-CLUSTER-01"
    category: str = "Snacks"
    sales_per_linear_ft: float
    private_brand_mix_pct: float
    in_stock_rate_pct: float
    shelf_capacity_utilization_pct: float
    updated_at: str


class SKUItemResponse(BaseModel):
    sku_id: str
    product_name: str
    sub_category: str
    sales_volume_weekly: float
    margin_pct: float
    linear_space_ft: float
    is_private_brand: bool
    status_badge: str

    class Config:
        from_attributes = True


class SKUListResponse(BaseModel):
    total_skus: int
    skus: List[SKUItemResponse]


class ActionSummary(BaseModel):
    GROW: int = 0
    MAINTAIN: int = 0
    SWAP: int = 0
    REDUCE: int = 0


class ScenarioResponse(BaseModel):
    scenario_id: str
    name: str
    projected_sales_lift_pct: float
    projected_private_brand_pct: float
    shelf_capacity_impact_pct: float
    action_summary: ActionSummary


class ScenarioListResponse(BaseModel):
    cluster_id: str = "STV-CLUSTER-01"
    default_scenario: str = "Balanced"
    scenarios: List[ScenarioResponse]


class SubmissionRequest(BaseModel):
    cluster_id: str = "STV-CLUSTER-01"
    category: str = "Snacks"
    scenario_name: str = "Balanced"
    user_id: str = "USR-CM-882"
    guardrails_override: bool = False


class SubmissionResponse(BaseModel):
    submission_id: str
    audit_ref_id: str
    status: str = "APPROVED_AND_LOGGED"
    scenario_name: str
    total_skus_modified: int
    guardrails_status: str = "PASSED"
    submitted_at: str
