from fastapi import APIRouter, HTTPException

from server.app.schemas.balance import BalanceRequest, BalanceResponse, ErrorResponse
from server.app.services import otp_service, cbs_service

router = APIRouter()

@router.post("/balance-inquiry", response_model=BalanceResponse, responses={401: {"model": ErrorResponse}, 503: {"model": ErrorResponse}})
async def balance_inquiry(request: BalanceRequest):
    # 1. Validate OTP
    is_otp_valid = await otp_service.validate_otp(request.account_number, request.otp)
    if not is_otp_valid:
        raise HTTPException(status_code=401, detail="Invalid OTP provided.")

    # 2. Fetch Balances from CBS
    try:
        balance_details = await cbs_service.fetch_balance(request.account_number)
        return balance_details
    except Exception as _:
        raise HTTPException(status_code=503, detail="Core Banking System currently unreachable.")
