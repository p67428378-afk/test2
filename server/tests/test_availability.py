import pytest
from fastapi.testclient import TestClient
from server.main import app
from server.database import Base, engine, SessionLocal, get_db
from server import models, auth


# Override get_db to use the same SessionLocal as the test
def override_get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def auth_headers():
    db = SessionLocal()
    guide = (
        db.query(models.Guide)
        .filter(models.Guide.email == "guide_avail@example.com")
        .first()
    )
    if not guide:
        guide = models.Guide(
            email="guide_avail@example.com",
            password_hash=auth.get_password_hash("password123"),
            full_name="Availability Guide",
        )
        db.add(guide)
        db.commit()
        db.refresh(guide)

    token = auth.create_access_token(data={"sub": guide.email})
    db.close()

    return {"Authorization": f"Bearer {token}"}


def test_update_and_get_availability(auth_headers):
    client = TestClient(app)
    # Update availability
    response = client.put(
        "/api/v1/availability",
        headers=auth_headers,
        json={"unavailable_dates": ["2026-08-15", "2026-08-16"]},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert "2026-08-15" in response.json()["unavailable_dates"]

    # Get availability
    response = client.get("/api/v1/availability", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["unavailable_date"] in ["2026-08-15", "2026-08-16"]
