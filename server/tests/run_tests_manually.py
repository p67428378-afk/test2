import sys
from fastapi.testclient import TestClient

# Add server to path
sys.path.insert(0, "")

from server.tests.conftest import engine, TestingSessionLocal, Base, app, get_db
from server import models
from server.auth import get_password_hash


def run_all_tests():
    print("Running tests manually...")

    # Setup database
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()

    # Seed test data
    test_user = models.User(
        username="testuser",
        email="test@example.com",
        hashed_password=get_password_hash("testpassword"),
        login_id="testuser",
        mobile_number="1234567890",
        security_question="What is your favorite color?",
        security_answer_hash=get_password_hash("blue"),
    )
    session = db
    session.add(test_user)
    session.commit()
    session.refresh(test_user)

    # Seed some worklist items
    items = [
        models.WorklistItem(
            name="Implement OAuth2 Authentication", status="To Do", user_id=test_user.id
        ),
        models.WorklistItem(
            name="Design Database Schema", status="In Progress", user_id=test_user.id
        ),
        models.WorklistItem(
            name="Setup CI/CD Pipeline", status="Done", user_id=test_user.id
        ),
    ]
    session.add_all(items)
    session.commit()

    def override_get_db():
        try:
            yield session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    client = TestClient(app)

    # 1. Test Auth
    print("Running Auth Tests...")
    response = client.post(
        "/api/v1/auth/token", json={"username": "testuser", "password": "testpassword"}
    )
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("OK: Auth Login Success Passed")

    response = client.post(
        "/api/v1/auth/token", json={"username": "testuser", "password": "wrongpassword"}
    )
    assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    print("OK: Auth Login Failure Passed")

    # 2. Test Worklist
    print("Running Worklist Tests...")
    response = client.get("/api/v1/worklist")
    assert response.status_code == 401, f"Expected 401, got {response.status_code}"
    print("OK: Get Worklist Unauthorized Passed")

    response = client.get("/api/v1/worklist", headers=headers)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert len(data) == 3, f"Expected 3 items, got {len(data)}"
    assert data[0]["name"] == "Implement OAuth2 Authentication"
    print("OK: Get Worklist Success Passed")

    response = client.post(
        "/api/v1/worklist",
        headers=headers,
        json={"name": "New Test Task", "status": "To Do"},
    )
    assert response.status_code == 201, f"Expected 201, got {response.status_code}"
    assert response.json()["name"] == "New Test Task"
    print("OK: Create Worklist Item Passed")

    # Get updated list
    response = client.get("/api/v1/worklist", headers=headers)
    items = response.json()
    task_id = items[0]["id"]

    response = client.put(
        f"/api/v1/worklist/{task_id}", headers=headers, json={"status": "In Progress"}
    )
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    assert response.json()["status"] == "In Progress", (
        f"Expected In Progress, got {response.json()['status']}"
    )
    print("OK: Update Worklist Item Status Passed")

    response = client.put(
        f"/api/v1/worklist/{task_id}", headers=headers, json={"status": "InvalidStatus"}
    )
    assert response.status_code == 422, f"Expected 422, got {response.status_code}"
    print("OK: Update Worklist Item Invalid Status Passed")

    fake_uuid = "00000000-0000-0000-0000-000000000000"
    response = client.put(
        f"/api/v1/worklist/{fake_uuid}", headers=headers, json={"status": "Done"}
    )
    assert response.status_code == 404, f"Expected 404, got {response.status_code}"
    print("OK: Update Worklist Item Not Found Passed")

    # 3. Test WebSocket
    print("Running WebSocket Tests...")
    with client.websocket_connect(f"/ws/worklist?token={token}"):
        print("OK: WebSocket Authorized Connection Passed")

    print("All tests passed successfully!")
    session.close()


if __name__ == "__main__":
    run_all_tests()
