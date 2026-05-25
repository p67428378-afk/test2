
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "KYC Onboarding Microservice"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "postgresql://user:password@localhost/kyc_db"
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: str = "your-access-key"
    AWS_SECRET_ACCESS_KEY: str = "your-secret-key"
    DYNAMODB_TABLE_NAME: str = "kyc_audit_trail"

    class Config:
        case_sensitive = True

settings = Settings()
