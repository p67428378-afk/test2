from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class ClusterKPIsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    cluster_id: str
    sales_per_linear_ft: float
    private_brand_share_pct: float
    instock_rate_pct: float
    shelf_capacity_utilization_pct: float
    last_updated: str


class SKUItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    sku_id: str
    name: str
    category: str
    velocity_units_per_wk: float
    margin_pct: float
    linear_ft_space: float
    is_private_brand: bool
    status_badge: str


class SKUListResponse(BaseModel):
    total_count: int
    skus: List[SKUItem]


class ScenarioItem(BaseModel):
    id: str
    label: str
    projected_sales_delta_pct: float
    projected_pb_share_pct: float
    shelf_capacity_impact_pct: float


class ScenariosResponse(BaseModel):
    default_selected: str
    scenarios: List[ScenarioItem]


class SubmitRecommendationRequest(BaseModel):
    cluster_id: str
    scenario_id: str
    manager_id: str
    notes: Optional[str] = None


class SubmitSummary(BaseModel):
    grow_count: int
    maintain_count: int
    swap_count: int
    reduce_count: int
    guardrails_satisfied: bool


class SubmitRecommendationResponse(BaseModel):
    status: str
    audit_reference_id: str
    timestamp: str
    submitted_by: str
    scenario: str
    summary: SubmitSummary
