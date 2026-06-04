from server.app.schemas.balance import BalanceResponse

async def fetch_balance(account_number: str) -> BalanceResponse:
    # In a real scenario, this would be a call to the Core Banking System.
    # For this example, we'll return a mock response.
    return BalanceResponse(
        status="BALANCE_DETAILS",
        available_balance="1500.00",
        ledger_balance="1600.00",
        currency="USD"
    )
