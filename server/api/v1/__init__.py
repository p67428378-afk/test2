from server.api.v1.expenses import router as expenses_router
from server.api.v1.dashboard import router as dashboard_router

__all__ = ["expenses_router", "dashboard_router"]
