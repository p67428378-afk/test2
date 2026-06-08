import pytest
from fastapi.testclient import TestClient

from server.main import app

client = TestClient(app)


@pytest.mark.parametrize(
    "vehicle_type, no_claim_years, expected_premium",
    [
        ("SUV", 3, 360.0),
        ("HATCHBACK", 0, 500.0),
        ("SEDAN", 1, 440.0),
        ("SPORTS_CAR", 5, 300.0),
        ("UNKNOWN", 2, 350.0),
        ("SUV", -1, 600.0),  # Should be treated as 0 years
        ("SEDAN", 6, 220.0),  # Should get max discount
    ],
)
def test_calculate_premium(vehicle_type, no_claim_years, expected_premium):
    response = client.post(
        "/api/v1/premiums/calculate",
        json={"vehicle_type": vehicle_type, "no_claim_years": no_claim_years},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["premium"] == expected_premium


def test_calculate_premium_invalid_input():
    response = client.post(
        "/api/v1/premiums/calculate",
        json={"vehicle_type": "SUV", "no_claim_years": "invalid"},
    )
    assert response.status_code == 422


# Since we don't have a database set up for testing yet, we can't fully test the /policies endpoint.
# We'll add a placeholder test that we expect to fail for now.
def test_read_policies():
    response = client.get("/api/v1/policies")
    assert response.status_code == 200
    # This will fail until we have a database connection for testing
    # and can create some test data.
    assert response.json() == {"policies": []}
