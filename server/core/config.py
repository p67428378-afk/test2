from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:password@localhost/dbname"
    TEST_DATABASE_URL: str = "sqlite:///./test.db"
    LMS_SERVICE_URL: str = "http://localhost:8001"
    TESTING: bool = False

    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')

settings = Settings()
