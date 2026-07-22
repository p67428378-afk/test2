import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from server.auth import get_password_hash, create_access_token
from server.models import User, Component


@pytest.fixture
def engineer_token(db_session: Session):
    hashed_password = get_password_hash("testpassword")
    user = User(
        email="test@example.com",
        full_name="Elena Rostova",
        role="Engineer",
        hashed_password=hashed_password,
    )
    db_session.add(user)
    db_session.commit()
    return create_access_token({"sub": user.email})


@pytest.fixture
def user_token(db_session: Session):
    hashed_password = get_password_hash("testpassword")
    user = User(
        email="regular@example.com",
        full_name="Regular User",
        role="user",
        hashed_password=hashed_password,
    )
    db_session.add(user)
    db_session.commit()
    return create_access_token({"sub": user.email})


def test_create_component(client: TestClient, engineer_token: str):
    # AC: I can add spacecraft components in the system
    headers = {"Authorization": f"Bearer {engineer_token}"}
    payload = {
        "name": "Thruster Valve TV-402",
        "description": "Main thruster control valve",
        "location": "Bay 4",
        "status": "Available",
        "inventory_count": 10,
    }
    response = client.post("/api/v1/components", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Thruster Valve TV-402"
    assert data["inventory_count"] == 10


def test_create_component_unauthorized(client: TestClient, user_token: str):
    # AC: Only users with 'Engineer' or 'Admin' roles can modify equipment details
    headers = {"Authorization": f"Bearer {user_token}"}
    payload = {
        "name": "Thruster Valve TV-402",
        "description": "Main thruster control valve",
        "location": "Bay 4",
        "status": "Available",
        "inventory_count": 10,
    }
    response = client.post("/api/v1/components", json=payload, headers=headers)
    assert response.status_code == 403


def test_list_components(client: TestClient, db_session: Session):
    # AC: I can view a list of all components and their current status
    comp1 = Component(
        name="Comp 1", location="Loc 1", status="Available", inventory_count=5
    )
    comp2 = Component(
        name="Comp 2", location="Loc 2", status="Out of Service", inventory_count=2
    )
    db_session.add_all([comp1, comp2])
    db_session.commit()

    response = client.get("/api/v1/components")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["name"] in ["Comp 1", "Comp 2"]


def test_list_components_filter(client: TestClient, db_session: Session):
    # AC: Filter components by status
    comp1 = Component(
        name="Comp 1", location="Loc 1", status="Available", inventory_count=5
    )
    comp2 = Component(
        name="Comp 2", location="Loc 2", status="Out of Service", inventory_count=2
    )
    db_session.add_all([comp1, comp2])
    db_session.commit()

    response = client.get("/api/v1/components?status=Out of Service")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Comp 2"


def test_get_component_details(client: TestClient, db_session: Session):
    # AC: Get details of a specific component
    comp = Component(
        name="Comp 1", location="Loc 1", status="Available", inventory_count=5
    )
    db_session.add(comp)
    db_session.commit()

    response = client.get(f"/api/v1/components/{comp.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Comp 1"


def test_update_component(client: TestClient, engineer_token: str, db_session: Session):
    # AC: I can edit spacecraft components in the system
    comp = Component(
        name="Comp 1", location="Loc 1", status="Available", inventory_count=5
    )
    db_session.add(comp)
    db_session.commit()

    headers = {"Authorization": f"Bearer {engineer_token}"}
    payload = {
        "name": "Comp 1 Updated",
        "description": "Updated description",
        "location": "Loc 1 Updated",
        "status": "Assigned",
        "inventory_count": 8,
    }
    response = client.put(
        f"/api/v1/components/{comp.id}", json=payload, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Comp 1 Updated"
    assert data["inventory_count"] == 8


def test_delete_component(client: TestClient, engineer_token: str, db_session: Session):
    # AC: I can delete spacecraft components in the system
    comp = Component(
        name="Comp 1", location="Loc 1", status="Available", inventory_count=5
    )
    db_session.add(comp)
    db_session.commit()

    headers = {"Authorization": f"Bearer {engineer_token}"}
    response = client.delete(f"/api/v1/components/{comp.id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["detail"] == "Component deleted successfully"

    # Verify deleted
    response = client.get(f"/api/v1/components/{comp.id}")
    assert response.status_code == 404
