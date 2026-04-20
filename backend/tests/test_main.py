from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"count": 0}

def test_increment():
    response = client.post("/increment")
    assert response.status_code == 200
    assert response.json() == {"count": 1}

    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"count": 1}
