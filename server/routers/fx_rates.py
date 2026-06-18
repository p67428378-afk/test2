from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.fx_rate import FXRateResponse
from server.services.fx_service import FXService

router = APIRouter()


@router.get("/fx-rates", response_model=FXRateResponse)
def get_fx_rates(
    source_currency: str = Query(..., description="Source currency (e.g., USD)"),
    target_currency: str = Query(..., description="Target currency (e.g., EUR)"),
    amount: float = Query(..., description="Amount to convert"),
    db: Session = Depends(get_db),
):
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero")

    if len(source_currency) != 3 or len(target_currency) != 3:
        raise HTTPException(status_code=400, detail="Invalid currency pair")

    try:
        fx_rate = FXService.fetch_rates(source_currency, target_currency, amount, db)

        # Calculate converted amount
        converted_amount = amount * float(fx_rate.ask_rate)

        return FXRateResponse(
            ask_rate=float(fx_rate.ask_rate),
            base_rate=float(fx_rate.base_rate),
            bid_rate=float(fx_rate.bid_rate),
            converted_amount=converted_amount,
            expires_at=fx_rate.expires_at,
            fee=float(fx_rate.fee),
            provider=fx_rate.provider,
            rate=float(fx_rate.ask_rate),
            rate_lock_id=fx_rate.rate_id,
            source_currency=fx_rate.source_currency,
            spread=float(fx_rate.spread),
            target_currency=fx_rate.target_currency,
        )
    except Exception as e:
        raise HTTPException(
            status_code=503, detail=f"Liquidity providers unavailable: {str(e)}"
        )
