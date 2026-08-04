from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()


class TabItem(BaseModel):
    id: str
    label: str
    icon: Optional[str] = None
    active: bool = True


class NavigationTabsResponse(BaseModel):
    sidebar_tabs: List[TabItem]
    topnav_tabs: List[TabItem]


@router.get("/tabs", response_model=NavigationTabsResponse)
def get_navigation_tabs():
    return NavigationTabsResponse(
        sidebar_tabs=[
            TabItem(
                id="overview", label="Overview", icon="LayoutDashboard", active=True
            ),
            TabItem(
                id="category_strategy",
                label="Category Strategy",
                icon="Target",
                active=True,
            ),
            TabItem(
                id="sku_performance",
                label="SKU Performance",
                icon="BarChart3",
                active=True,
            ),
            TabItem(
                id="store_clusters",
                label="Store Clusters",
                icon="Store",
                active=True,
            ),
            TabItem(
                id="audit_history", label="Audit History", icon="History", active=True
            ),
        ],
        topnav_tabs=[
            TabItem(
                id="assortment_advisor",
                label="Assortment Advisor",
                icon="Advisor",
                active=True,
            ),
            TabItem(
                id="scenario_modeler",
                label="Scenario Modeler",
                icon="Modeler",
                active=True,
            ),
            TabItem(
                id="guardrail_rules",
                label="Guardrail Rules",
                icon="Rules",
                active=True,
            ),
            TabItem(
                id="approval_queue",
                label="Approval Queue",
                icon="Queue",
                active=True,
            ),
        ],
    )
