from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:password@localhost/kyc_db"
    RBI_SANCTIONS_API_URL: str = "https://rbi-sanctions-api.gov.in"
    UIDAI_API_URL: str = "https://uidai-api.gov.in"
    NSDL_API_URL: str = "https://nsdl-api.gov.in"

    class Config:
        env_file = ".env"

settings = Settings()
