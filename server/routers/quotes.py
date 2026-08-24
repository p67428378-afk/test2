import random
import httpx
from datetime import datetime
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Quote
from server.schemas import QuoteResponse

router = APIRouter(prefix="/api/v1/quotes", tags=["Quotes"])

# In-memory cache for Quote of the Day
# Format: {"date": "YYYY-MM-DD", "quote": QuoteResponse}
_qotd_cache: Dict[str, Any] = {}


def fetch_external_qotd() -> Optional[dict]:
    """Fetch quote of the day from an external API."""
    try:
        # Try ZenQuotes API
        response = httpx.get("https://zenquotes.io/api/today", timeout=3.0)
        if response.status_code == 200:
            data = response.json()
            if data and isinstance(data, list) and len(data) > 0:
                item = data[0]
                return {
                    "text": item.get("q", ""),
                    "author": item.get("a", "Unknown"),
                    "category": "Inspiration",
                }
    except Exception:
        pass
    return None


@router.get("/daily", response_model=QuoteResponse)
def get_daily_quote(db: Session = Depends(get_db)):
    """
    Fetch the quote of the day.
    Uses in-memory caching based on the current date (updates every 24 hours).
    Falls back to database quotes if external API fails.
    """
    today_str = datetime.utcnow().strftime("%Y-%m-%d")

    # Check cache first
    if _qotd_cache.get("date") == today_str:
        # Verify the cached quote still exists in DB or is valid
        cached_quote = _qotd_cache.get("quote")
        if cached_quote:
            return cached_quote

    # Try to fetch from external API
    ext_quote = fetch_external_qotd()
    if ext_quote:
        # Save external quote to DB so it gets an ID and can be favorited
        existing = db.query(Quote).filter(Quote.text == ext_quote["text"]).first()
        if not existing:
            db_quote = Quote(
                text=ext_quote["text"],
                author=ext_quote["author"],
                category=ext_quote["category"],
            )
            db.add(db_quote)
            db.commit()
            db.refresh(db_quote)
        else:
            db_quote = existing

        _qotd_cache["date"] = today_str
        _qotd_cache["quote"] = db_quote
        return db_quote

    # Fallback: Select deterministically from DB based on date
    quotes = db.query(Quote).all()
    if not quotes:
        # If DB is somehow empty, raise 404
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No quotes available in the database",
        )

    # Deterministic selection based on day of the year
    day_of_year = datetime.utcnow().timetuple().tm_yday
    selected_quote = quotes[day_of_year % len(quotes)]

    _qotd_cache["date"] = today_str
    _qotd_cache["quote"] = selected_quote
    return selected_quote


@router.get("/random", response_model=QuoteResponse)
def get_random_quote(db: Session = Depends(get_db)):
    """
    Fetch a random quote from the database.
    """
    quotes = db.query(Quote).all()
    if not quotes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No quotes available in the database",
        )
    return random.choice(quotes)
