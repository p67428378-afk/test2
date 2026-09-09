import pytest
from server.models import AuditLog


def test_audit_logs_access_control(
    client, admin_headers, auditor_headers, investigator_headers
):
    # Admin can access
    admin_res = client.get("/api/v1/audit-logs", headers=admin_headers)
    assert admin_res.status_code == 200

    # Auditor can access
    auditor_res = client.get("/api/v1/audit-logs", headers=auditor_headers)
    assert auditor_res.status_code == 200
    assert auditor_res.json()["total"] >= 1

    # Investigator cannot access
    inv_res = client.get("/api/v1/audit-logs", headers=investigator_headers)
    assert inv_res.status_code == 403


def test_audit_logs_search_and_filter(client, auditor_headers):
    res = client.get("/api/v1/audit-logs?query=alice", headers=auditor_headers)
    assert res.status_code == 200
    data = res.json()
    assert "items" in data


def test_audit_log_immutability(db_session):
    log = db_session.query(AuditLog).first()
    assert log is not None

    with pytest.raises(ValueError, match="TAMPER ERROR"):
        log.action = "TAMPERED_ACTION"
        db_session.flush()
