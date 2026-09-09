import hashlib


def test_evidence_upload_url_flow(client, investigator_headers):
    # Request upload URL
    req_payload = {
        "evidence_code": "EVID-9001",
        "file_name": "surveillance_clip.mp4",
        "file_type": "Video / MP4",
        "file_size_bytes": 104857600,
        "collection_location": "Main St & 5th Ave ATM",
        "source_device": "ATM Security Camera #2",
    }
    res = client.post(
        "/api/v1/evidence/upload-url",
        json=req_payload,
        headers=investigator_headers,
    )
    assert res.status_code == 201
    url_data = res.json()
    assert url_data["evidence_code"] == "EVID-9001"
    assert "upload_url" in url_data
    evidence_id = url_data["evidence_id"]

    # Confirm upload with calculated hash
    dummy_hash = hashlib.sha256(b"dummy video content").hexdigest()
    confirm_payload = {
        "evidence_id": evidence_id,
        "sha256_hash": dummy_hash,
        "file_size_bytes": 104857600,
        "transfer_reason": "Direct ingestion from field camera",
    }
    confirm_res = client.post(
        "/api/v1/evidence/confirm-upload",
        json=confirm_payload,
        headers=investigator_headers,
    )
    assert confirm_res.status_code == 200
    item = confirm_res.json()
    assert item["sha256_hash"] == dummy_hash
    assert item["evidence_code"] == "EVID-9001"


def test_evidence_file_size_limit_exceeded(client, investigator_headers):
    # Try requesting upload URL for file > 5GB (5 * 1024 * 1024 * 1024 + 1)
    too_large_bytes = (5 * 1024 * 1024 * 1024) + 1024
    req_payload = {
        "evidence_code": "EVID-9099",
        "file_name": "huge_dump.iso",
        "file_type": "Binary / Disk Image",
        "file_size_bytes": too_large_bytes,
    }
    res = client.post(
        "/api/v1/evidence/upload-url",
        json=req_payload,
        headers=investigator_headers,
    )
    # Pydantic or endpoint validates le=5GB
    assert res.status_code in [400, 422]


def test_direct_evidence_upload(client, investigator_headers):
    file_bytes = b"Digital Forensic Evidence Memory Dump Test Artifact"
    expected_hash = hashlib.sha256(file_bytes).hexdigest()

    response = client.post(
        "/api/v1/evidence/upload",
        files={"file": ("memory_dump.bin", file_bytes, "application/octet-stream")},
        data={
            "evidence_code": "EVID-9002",
            "file_type": "Memory Dump",
            "collection_location": "Server Room Rack 4",
            "source_device": "Forensic Imager TX1",
        },
        headers=investigator_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["evidence_code"] == "EVID-9002"
    assert data["sha256_hash"] == expected_hash
    assert data["file_size_bytes"] == len(file_bytes)


def test_list_and_get_evidence(client, investigator_headers):
    # List
    res = client.get("/api/v1/evidence", headers=investigator_headers)
    assert res.status_code == 200
    list_data = res.json()
    assert list_data["total"] >= 1
    assert len(list_data["items"]) >= 1

    # Get by code
    get_res = client.get("/api/v1/evidence/EVID-1001", headers=investigator_headers)
    assert get_res.status_code == 200
    assert get_res.json()["evidence_code"] == "EVID-1001"


def test_verify_evidence_integrity(client, investigator_headers):
    res = client.get("/api/v1/evidence/EVID-1001/verify", headers=investigator_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["evidence_code"] == "EVID-1001"
    assert data["is_valid"] is True


def test_evidence_upload_unauthorized_for_observer(client, observer_headers):
    req_payload = {
        "evidence_code": "EVID-9999",
        "file_name": "test.txt",
        "file_type": "Document",
        "file_size_bytes": 100,
    }
    res = client.post(
        "/api/v1/evidence/upload-url",
        json=req_payload,
        headers=observer_headers,
    )
    assert res.status_code == 403
