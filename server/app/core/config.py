
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Internet Banking Password Reset Microservice"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./test.db"  # Default to SQLite for simplicity
    
    # Mock URLs for external services
    CBS_API_URL: str = "http://mock-cbs/api"
    SESSION_INVALIDATION_API_URL: str = "http://mock-session-ms/api"

    # Security settings
    SECRET_KEY: str = "a_very_secret_key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # OTP settings
    OTP_EXPIRE_MINUTES: int = 5
    OTP_LENGTH: int = 6
    
    # Password complexity rules
    PASSWORD_MIN_LENGTH: int = 12
    
    # Rate limiting
    RATE_LIMIT_TIMES: int = 5
    RATE_LIMIT_MINUTES: int = 15
    
    # Lockout settings
    LOCKOUT_MINUTES: int = 30

    class Config:
        case_sensitive = True

settings = Settings()
