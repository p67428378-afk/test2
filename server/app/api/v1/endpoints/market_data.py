
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class MarketDepth(BaseModel):
    instrument_id: str
    bid_price: float
    ask_price: float
    timestamp: str

@router.get("/depth/{instrument_id}", response_model=MarketDepth)
def get_market_depth(instrument_id: str):
    # In a real application, this would fetch data from a live feed.
    # For this example, we'll return some mock data.
    if instrument_id == "AAPL":
        return MarketDepth(
            instrument_id="AAPL",
            bid_price=175.40,
            ask_price=175.60,
            timestamp=datetime.utcnow().isoformat()
        )
    raise HTTPException(status_code=404, detail="Instrument not found")
