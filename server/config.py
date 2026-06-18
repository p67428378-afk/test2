import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    TESTING: bool = os.getenv("TESTING", "false").lower() == "true"

    # Risk & Compliance thresholds
    FRAUD_THRESHOLD: float = 0.75
    COMPLIANCE_RISK_THRESHOLD: float = 0.75

    # Mock Liquidity Providers
    LIQUIDITY_PROVIDERS: list[str] = ["Swissquote", "Rada Forex", "LMAX", "Saxo Bank"]

    class Config:
        env_file = ".env"


settings = Settings()
