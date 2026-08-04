from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session
from server.app.models.assortment import Cluster, SKU, SKUClusterMetrics
from server.app.schemas.assortment import (
    ClusterKPIsResponse,
    SKUItem,
    SKUListResponse,
    ScenarioItem,
    ScenariosResponse,
)


class AssortmentService:
    @staticmethod
    def get_cluster_kpis(
        db: Session, cluster_id: str = "small-town-value"
    ) -> Optional[ClusterKPIsResponse]:
        cluster = db.query(Cluster).filter(Cluster.cluster_code == cluster_id).first()
        if not cluster:
            return None

        # Return aggregate or target KPI metrics
        return ClusterKPIsResponse(
            cluster_id=cluster.cluster_code,
            sales_per_linear_ft=245.50,
            private_brand_share_pct=28.5,
            instock_rate_pct=96.2,
            shelf_capacity_utilization_pct=92.0,
            last_updated=datetime.now(timezone.utc).strftime("%Y-%m-%d%H:%M:%SZ"),
        )

    @staticmethod
    def get_cluster_skus(
        db: Session,
        cluster_id: str = "small-town-value",
        category: Optional[str] = None,
    ) -> SKUListResponse:
        query = (
            db.query(SKU, SKUClusterMetrics)
            .join(SKUClusterMetrics, SKU.id == SKUClusterMetrics.sku_id)
            .join(Cluster, Cluster.id == SKUClusterMetrics.cluster_id)
            .filter(Cluster.cluster_code == cluster_id)
        )

        if category:
            query = query.filter(SKU.category.ilike(f"%{category}%"))

        results = query.all()

        sku_items = []
        for sku, metric in results:
            sku_items.append(
                SKUItem(
                    sku_id=sku.sku_code,
                    name=sku.name,
                    category=sku.category,
                    velocity_units_per_wk=metric.velocity_units_per_wk,
                    margin_pct=sku.unit_margin_pct,
                    linear_ft_space=sku.linear_ft_space,
                    is_private_brand=sku.is_private_brand,
                    status_badge=metric.status_badge,
                )
            )

        return SKUListResponse(total_count=len(sku_items), skus=sku_items)

    @staticmethod
    def get_scenarios() -> ScenariosResponse:
        scenarios = [
            ScenarioItem(
                id="conservative",
                label="Conservative",
                projected_sales_delta_pct=2.1,
                projected_pb_share_pct=26.0,
                shelf_capacity_impact_pct=88.0,
            ),
            ScenarioItem(
                id="balanced",
                label="Balanced",
                projected_sales_delta_pct=5.2,
                projected_pb_share_pct=28.5,
                shelf_capacity_impact_pct=92.0,
            ),
            ScenarioItem(
                id="aggressive",
                label="Aggressive",
                projected_sales_delta_pct=8.4,
                projected_pb_share_pct=32.0,
                shelf_capacity_impact_pct=95.0,
            ),
        ]
        return ScenariosResponse(default_selected="balanced", scenarios=scenarios)
