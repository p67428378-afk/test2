from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Account Balance Inquiry Microservice"
    admin_email: str = "admin@example.com"
    otp_service_url: str = "http://localhost:8001"  # Mock OTP service
    cbs_service_url: str = "http://localhost:8002"  # Mock CBS service

    class Config:
        env_file = ".env"

settings = Settings()
