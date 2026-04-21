from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./test.db"

    model_config = SettingsConfigDict(case_sensitive=True)

settings = Settings()
