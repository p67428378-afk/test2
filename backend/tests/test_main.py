from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_get_count():
    response = client.get("/api/count")
    assert response.status_code == 200
    assert response.json() == {"count": 0}

def test_increment_count():
    # Increment first time
    response = client.post("/api/increment")
    assert response.status_code == 200
    assert response.json() == {"count": 1}

    # Increment second time
    response = client.post("/api/increment")
    assert response.status_code == 200
    assert response.json() == {"count": 2}

    # Check that get_count returns the correct value
    response = client.get("/api/count")
    assert response.status_code == 200
    assert response.json() == {"count": 2}
