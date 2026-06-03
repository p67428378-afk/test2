
from fastapi import APIRouter
from . import payouts, tds

router = APIRouter()
router.include_router(payouts.router, prefix="/payouts", tags=["payouts"])
router.include_router(tds.router, prefix="/tds", tags=["tds"])
