"""
test_password_reset.py — Tests for the password reset endpoints.
Uses the shared StaticPool in-memory engine from conftest.py.
"""
from fastapi.testclient import TestClient
from server.main import app


def test_initiate_password_reset():
    client = TestClient(app)
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
    client = TestClient(app)
    response = client.post(
        "/api/v1/password-reset/verify-otp",
        json={"otp_code": "123456", "otp_session_id": "dummy_otp_session_id"},
    )
    assert response.status_code == 200
    assert response.json() == {"security_question_session_id": "dummy_sq_session_id"}


def test_verify_security_question():
    client = TestClient(app)
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
    client = TestClient(app)
    response = client.post(
        "/api/v1/password-reset/set-new-password",
        json={
            "new_password": "new_password",
            "password_reset_session_id": "dummy_pr_session_id",
        },
    )
    assert response.status_code == 200
    assert response.json() == {"status": "RESET SUCCESSFUL", "login_link": "/login"}
