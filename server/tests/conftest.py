import pytest
from fastapi.testclient import TestClient
from server.main import app


@pytest.fixture(scope="session")
def client():
    """Shared TestClient fixture for FastAPI application tests."""
    with TestClient(app) as test_client:
        yield test_client
