
import os

class Settings:
    PROJECT_NAME: str = "DG Cluster Assortment Advisor"
    PROJECT_VERSION: str = "1.0.0"

    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    TESTING: bool = os.getenv("TESTING", "false").lower() == "true"

settings = Settings()
