import uuid


def test_verify_visitor_success(client):
    # Register a new visitor
    reg_res = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Bob Smith",
            "national_id": "NAT-77889900",
            "email": "bob.smith@example.com",
            "phone": "555-1122",
            "address": "100 Oak Ave",
            "photo_id_url": "https://storage.googleapis.com/bucket/bob.jpg",
        },
    )
    assert reg_res.status_code == 201
    visitor_id = reg_res.json()["id"]

    # Perform verification
    verif_res = client.post(
        "/api/v1/verifications",
        json={
            "visitor_id": visitor_id,
            "officer_id": str(uuid.uuid4()),
            "verification_status": "VERIFIED",
            "notes": "Government photo ID matches database.",
        },
    )
    assert verif_res.status_code == 201
    verif_data = verif_res.json()
    assert verif_data["verification_status"] == "VERIFIED"

    # Check visitor profile now reflects VERIFIED
    profile_res = client.get(f"/api/v1/visitors/{visitor_id}")
    assert profile_res.status_code == 200
    assert profile_res.json()["verification_status"] == "VERIFIED"


def test_reject_visitor_verification(client):
    reg_res = client.post(
        "/api/v1/visitors/register",
        json={
            "full_name": "Charlie Bad",
            "national_id": "NAT-66778899",
            "email": "charlie@example.com",
            "phone": "555-9988",
            "address": "200 Elm St",
            "photo_id_url": "https://storage.googleapis.com/bucket/charlie.jpg",
        },
    )
    assert reg_res.status_code == 201
    visitor_id = reg_res.json()["id"]

    verif_res = client.post(
        "/api/v1/verifications",
        json={
            "visitor_id": visitor_id,
            "officer_id": str(uuid.uuid4()),
            "verification_status": "REJECTED",
            "notes": "Invalid ID document blurred.",
        },
    )
    assert verif_res.status_code == 201
    assert verif_res.json()["verification_status"] == "REJECTED"

    profile_res = client.get(f"/api/v1/visitors/{visitor_id}")
    assert profile_res.status_code == 200
    assert profile_res.json()["verification_status"] == "REJECTED"
