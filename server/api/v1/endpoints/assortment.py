from fastapi import APIRouter
from server.app.api.kpis import router as kpis_router
from server.app.api.skus import router as skus_router
from server.app.api.scenarios import router as scenarios_router
from server.app.api.submissions import router as submissions_router

router = APIRouter()
router.include_router(kpis_router)
router.include_router(skus_router)
router.include_router(scenarios_router)
router.include_router(submissions_router)
