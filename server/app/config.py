import os


class Settings:
    PROJECT_NAME: str = "HealthQuest API"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")


settings = Settings()
