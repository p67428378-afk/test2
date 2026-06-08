class OTPService:
    @staticmethod
    def validate_otp(account_number: str, otp: str) -> bool:
        """
        Validates the OTP for the given account number.
        In a real system, this would call an external OTP service.
        For this microservice, we accept '123456' as a valid OTP for testing.
        """
        if otp == "123456":
            return True
        return False
