from fastapi.testclient import TestClient
from server.main import app
from server.database import get_db, SessionLocal


# Use the standard SessionLocal to avoid overriding with a clean empty DB
def override_get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_initiate_password_reset():
    response = client.post(
        "/api/v1/password-reset/initiate",
        json={"login_id": "testuser", "mobile_number": "1234567890"},
    )
    assert response.status_code == 200
    assert response.json() == {
        "otp_session_id": "dummy_otp_session_id",
        "security_question": "dummy_security_question",
    }


def test_verify_otp():
    response = client.post(
        "/api/v1/password-reset/verify-otp",
        json={"otp_code": "123456", "otp_session_id": "dummy_otp_session_id"},
    )
    assert response.status_code == 200
    assert response.json() == {"security_question_session_id": "dummy_sq_session_id"}


def test_verify_security_question():
    response = client.post(
        "/api/v1/password-reset/verify-security-question",
        json={
            "answer": "dummy_answer",
            "security_question_session_id": "dummy_sq_session_id",
        },
    )
    assert response.status_code == 200
    assert response.json() == {"password_reset_session_id": "dummy_pr_session_id"}


def test_set_new_password():
    response = client.post(
        "/api/v1/password-reset/set-new-password",
        json={
            "new_password": "new_password",
            "password_reset_session_id": "dummy_pr_session_id",
        },
    )
    assert response.status_code == 200
    assert response.json() == {"status": "RESET SUCCESSFUL", "login_link": "/login"}
