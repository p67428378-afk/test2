import httpx
from app.core.config import settings

MIN_FICO_SCORE = 670
MIN_ANNUAL_INCOME = 30000

def is_eligible(credit_score: float, annual_income: float) -> tuple[bool, str | None]:
    if credit_score < MIN_FICO_SCORE:
        return False, "Credit score is too low."
    if annual_income < MIN_ANNUAL_INCOME:
        return False, "Annual income is too low."
    return True, None

async def get_credit_score(application_id: str) -> float:
    # In a real application, this would call a third-party API.
    # For this example, we'll return a mock value.
    # async with httpx.AsyncClient() as client:
    #     response = await client.get(f"{settings.FICO_API_URL}/{application_id}")
    #     response.raise_for_status()
    #     return response.json()["credit_score"]
    return 700.0 # Mock value
