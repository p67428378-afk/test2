import pytest
from server.models import ChainOfCustodyEntry


def test_chain_of_custody_transfer_flow(client, investigator_headers, admin_headers):
    # Fetch an evidence item
    evid_res = client.get("/api/v1/evidence/EVID-1002", headers=investigator_headers)
    assert evid_res.status_code == 200
    evidence = evid_res.json()
    evidence_id = evidence["id"]

    # Transfer custody to Administrator
    transfer_payload = {
        "evidence_id": evidence_id,
        "new_custodian_id": "11111111-1111-1111-1111-111111111111",
        "transfer_reason": "Transfer to Evidence Vault Master Custodian",
        "location_context": "Central Vault Room 101",
        "departing_signoff": True,
        "receiving_signoff": True,
    }
    transfer_res = client.post(
        "/api/v1/chain-of-custody/transfer",
        json=transfer_payload,
        headers=investigator_headers,
    )
    assert transfer_res.status_code == 201
    coc = transfer_res.json()
    assert coc["action"] == "TRANSFER"
    assert coc["new_custodian_id"] == "11111111-1111-1111-1111-111111111111"

    # Verify evidence item now has updated custodian
    updated_evid = client.get(
        f"/api/v1/evidence/{evidence_id}", headers=investigator_headers
    ).json()
    assert (
        updated_evid["current_custodian_id"] == "11111111-1111-1111-1111-111111111111"
    )

    # Verify chain of custody history
    history_res = client.get(
        f"/api/v1/chain-of-custody/{evidence_id}", headers=investigator_headers
    )
    assert history_res.status_code == 200
    hist = history_res.json()
    assert hist["total_entries"] >= 2
    assert (
        hist["history"][-1]["transfer_reason"]
        == "Transfer to Evidence Vault Master Custodian"
    )


def test_chain_of_custody_action_recording(client, investigator_headers):
    action_payload = {
        "evidence_id": "EVID-1001",
        "action": "VIEW",
        "reason": "Forensic preliminary inspection by lead examiner",
        "location_context": "Forensics Lab Terminal 1",
    }
    res = client.post(
        "/api/v1/chain-of-custody/action",
        json=action_payload,
        headers=investigator_headers,
    )
    assert res.status_code == 201
    entry = res.json()
    assert entry["action"] == "VIEW"
    assert (
        entry["transfer_reason"] == "Forensic preliminary inspection by lead examiner"
    )


def test_immutability_of_custody_records(db_session):
    coc = db_session.query(ChainOfCustodyEntry).first()
    assert coc is not None

    # Modifying or deleting should raise ValueError from event listeners
    with pytest.raises(ValueError, match="TAMPER ERROR"):
        coc.transfer_reason = "Modified Reason Attempt"
        db_session.flush()
