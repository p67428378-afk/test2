import time
import threading
from typing import Any, Optional, Dict, Tuple


class CacheService:
    def __init__(self):
        self._cache: Dict[str, Tuple[Any, float]] = {}
        self._lock = threading.Lock()

    def get(self, key: str) -> Optional[Any]:
        """Retrieve a cached value if it has not expired."""
        with self._lock:
            if key not in self._cache:
                return None
            value, expiry = self._cache[key]
            if time.time() > expiry:
                del self._cache[key]
                return None
            return value

    def set(self, key: str, value: Any, ttl_seconds: int = 600) -> None:
        """Store a value with a time-to-live in seconds."""
        with self._lock:
            expiry = time.time() + ttl_seconds
            self._cache[key] = (value, expiry)

    def invalidate(self, key: str) -> bool:
        """Remove a specific key from cache."""
        with self._lock:
            if key in self._cache:
                del self._cache[key]
                return True
            return False

    def clear(self) -> None:
        """Clear all cached entries."""
        with self._lock:
            self._cache.clear()


cache_service = CacheService()
