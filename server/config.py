from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./weather.db"
    OPENWEATHER_API_KEY: str = "mock-api-key"  # Default to mock for testing/dev
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    TESTING: bool = False

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


settings = Settings()
