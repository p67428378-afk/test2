
import random
import string

def generate_otp(length: int = 6) -> str:
    """Generate a random OTP."""
    return "".join(random.choices(string.digits, k=length))

def send_otp(contact: str, otp: str) -> bool:
    """Simulate sending an OTP to a contact (email or SMS)."""
    print(f"Sending OTP {otp} to {contact}")
    # In a real application, this would integrate with an SMS/email gateway
    return True
