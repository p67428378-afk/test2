from server.app.api.v1.assortment import (
    router,
    get_cluster_kpis,
    get_cluster_skus,
    get_scenarios,
    submit_recommendation,
)

__all__ = [
    "router",
    "get_cluster_kpis",
    "get_cluster_skus",
    "get_scenarios",
    "submit_recommendation",
]
