from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class KPIResponse(BaseModel):
    in_stock_rate: float
    private_brand_pct: float
    sales_per_linear_ft: float
    sales_trend_pct: float
    shelf_capacity_pct: float

class SKUResponse(BaseModel):
    sku: str
    name: str
    sales_volume: float
    sales_trend: float
    is_private_brand: bool
    status: str

    class Config:
        from_attributes = True

class GuardrailsInfo(BaseModel):
    message: str
    private_brand_passed: bool
    sku_count_passed: bool

class SKUActionItem(BaseModel):
    sku: str
    name: str
    is_private_brand: bool
    action: str

class ScenarioResponse(BaseModel):
    scenario_name: str
    projected_sales: float
    projected_private_brand_pct: float
    projected_shelf_capacity_pct: float
    sku_count: int
    actions: Dict[str, int]
    guardrails: GuardrailsInfo
    sku_action_list: List[SKUActionItem]

class SKUActionInput(BaseModel):
    sku: str
    action: str

class AssortmentPlanCreate(BaseModel):
    scenario_name: str
    submitted_by: str
    projected_sales: float
    projected_private_brand_pct: float
    sku_action_list: List[SKUActionInput]

class AssortmentPlanResponse(BaseModel):
    id: str
    scenario_name: str
    submitted_by: str
    submitted_at: datetime
    guardrails_passed: bool
    projected_sales: float
    projected_private_brand_pct: float
    audit_trail_id: str
    summary: str

    class Config:
        from_attributes = True
