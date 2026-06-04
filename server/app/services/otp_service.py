async def validate_otp(account_number: str, otp: str) -> bool:
    # In a real scenario, this would be a call to an external OTP service.
    # For this example, we'll use a simple mock validation.
    if otp == "987654":
        return True
    return False
