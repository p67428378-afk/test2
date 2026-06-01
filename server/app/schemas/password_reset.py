
from pydantic import BaseModel, constr
from typing import Optional

# Initiate Password Reset
class InitiateResetRequest(BaseModel):
    login_id: str
    mobile_number: str

class InitiateResetResponse(BaseModel):
    status: str = "OTP_SENT"
    message: str = "An OTP has been sent to your registered mobile number."

# Verify OTP
class VerifyOTPRequest(BaseModel):
    login_id: str
    otp: constr(min_length=6, max_length=6)

class VerifyOTPResponse(BaseModel):
    status: str = "OTP_VERIFIED"
    message: str = "OTP verified successfully. Please answer your security question."
    security_question: str

# Verify Security Question
class VerifySecurityQuestionRequest(BaseModel):
    login_id: str
    answer: str

class VerifySecurityQuestionResponse(BaseModel):
    status: str = "VERIFIED_SUCCESS"
    message: str = "Identity verified. You can now set a new password."
    reset_token: str

# Set New Password
class SetPasswordRequest(BaseModel):
    login_id: str
    reset_token: str
    new_password: str

class SetPasswordResponse(BaseModel):
    status: str = "RESET_SUCCESSFUL"
    message: str = "Your password has been reset successfully."
    login_link: str

# General Error Response
class ErrorResponse(BaseModel):
    detail: str
