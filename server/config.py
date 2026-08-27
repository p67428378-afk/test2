"""Application configuration module."""

import os
from typing import List

DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:////tmp/podcast_hub.db")
ALLOWED_ORIGINS_STR: str = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
)
ALLOWED_ORIGINS: List[str] = [
    origin.strip() for origin in ALLOWED_ORIGINS_STR.split(",") if origin.strip()
]
TESTING: bool = os.getenv("TESTING", "false").lower() in ("true", "1")
