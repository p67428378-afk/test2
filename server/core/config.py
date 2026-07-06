from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./test.db"
    TESTING: bool = False
    JWT_SECRET: str = (
        "super-secret-key-for-jwt-token-generation-and-verification-123456"
    )
    JWT_ALGORITHM: str = "HS256"
    REDIS_URL: str = "redis://localhost:6379/0"


settings = Settings()
