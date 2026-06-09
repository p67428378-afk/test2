from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# KPI Schema
class KPIDashboardResponse(BaseModel):
    sales_linear_ft: float
    private_brand_pct: float
    in_stock_rate: float
    shelf_capacity: float

    class Config:
        from_attributes = True


# SKU Schema
class SKUPerformanceResponse(BaseModel):
    product_id: str
    sku: str
    name: str
    margin: float
    sales: float
    shelf_space: float
    in_stock: bool
    is_private_brand: bool
    status: str

    class Config:
        from_attributes = True


# Scenario Item Schemas
class ScenarioItemAdd(BaseModel):
    sku: str
    name: str
    is_private_brand: bool
    shelf_space: float

    class Config:
        from_attributes = True


class ScenarioItemRemove(BaseModel):
    product_id: Optional[str] = None
    sku: str
    name: str

    class Config:
        from_attributes = True


# Scenario Schema
class ScenarioResponse(BaseModel):
    id: str = Field(..., alias="scenario_id")
    name: str
    description: Optional[str] = None
    projected_sales_lift: float
    new_private_brand_pct: float
    shelf_space_impact_ft: float
    items_to_add: List[ScenarioItemAdd] = []
    items_to_remove: List[ScenarioItemRemove] = []

    class Config:
        from_attributes = True
        populate_by_name = True


# Scenario Selection Schemas
class ScenarioSelectRequest(BaseModel):
    scenario_id: str


class ScenarioSelectResponse(BaseModel):
    selected_scenario_id: str
    success: bool


# Approval Schemas
class ApprovalRequest(BaseModel):
    scenario_id: str
    approver_name: str


class GuardrailStatus(BaseModel):
    new_sku_limit_check: str
    private_brand_check: str
    shelf_space_check: str


class ApprovalResponse(BaseModel):
    approval_id: str
    approver_name: str
    guardrail_status: GuardrailStatus
    selected_scenario: str
    success: bool
    timestamp: str
