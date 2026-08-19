def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_create_maintenance_event_success(client):
    payload = {
        "title": "Scheduled Router Replacement",
        "event_date": "2026-05-01T10:00:00Z",
        "location": "Building A - 2nd Floor",
        "maintenance_type": "Hardware Replacement",
        "vendor_technician": "NetTech Solutions",
        "cost": 450.00,
        "description": "Replaced core router with upgraded model due to high latency.",
    }
    response = client.post("/api/v1/maintenance-events/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["cost"] == 450.00
    assert data["location"] == payload["location"]
    assert "id" in data
    assert "created_at" in data


def test_create_maintenance_event_negative_cost_validation(client):
    payload = {
        "title": "Invalid Negative Cost Repair",
        "event_date": "2026-05-01T10:00:00Z",
        "location": "Building B",
        "maintenance_type": "Urgent Repair",
        "vendor_technician": "ACME Tech",
        "cost": -100.00,
        "description": "Negative cost test",
    }
    response = client.post("/api/v1/maintenance-events/", json=payload)
    assert response.status_code == 422


def test_create_maintenance_event_zero_cost_allowed(client):
    payload = {
        "title": "Warranty AP Replacement",
        "event_date": "2026-05-02T11:00:00Z",
        "location": "Building C - Lobby",
        "maintenance_type": "Firmware Upgrade",
        "vendor_technician": "Vendor Representative",
        "cost": 0.00,
        "description": "Covered under vendor warranty.",
    }
    response = client.post("/api/v1/maintenance-events/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["cost"] == 0.00


def test_get_event_by_id(client):
    create_payload = {
        "title": "Switch Maintenance",
        "event_date": "2026-05-03T12:00:00Z",
        "location": "Datacenter R1",
        "maintenance_type": "Scheduled",
        "vendor_technician": "In-House Admin",
        "cost": 250.00,
        "description": "Port cleaning and patch panel cable organization.",
    }
    create_res = client.post("/api/v1/maintenance-events/", json=create_payload)
    assert create_res.status_code == 201
    event_id = create_res.json()["id"]

    get_res = client.get(f"/api/v1/maintenance-events/{event_id}")
    assert get_res.status_code == 200
    assert get_res.json()["title"] == "Switch Maintenance"


def test_get_event_not_found(client):
    response = client.get("/api/v1/maintenance-events/non-existent-uuid")
    assert response.status_code == 404


def test_update_maintenance_event(client):
    create_payload = {
        "title": "Initial Inspection",
        "event_date": "2026-05-04T09:00:00Z",
        "location": "Building D",
        "maintenance_type": "Scheduled",
        "vendor_technician": "Tech A",
        "cost": 100.00,
        "description": "Visual inspection",
    }
    create_res = client.post("/api/v1/maintenance-events/", json=create_payload)
    event_id = create_res.json()["id"]

    update_payload = {
        "cost": 150.00,
        "description": "Updated inspection with cable replacement",
    }
    update_res = client.put(
        f"/api/v1/maintenance-events/{event_id}", json=update_payload
    )
    assert update_res.status_code == 200
    assert update_res.json()["cost"] == 150.00
    assert (
        update_res.json()["description"] == "Updated inspection with cable replacement"
    )


def test_delete_maintenance_event(client):
    create_payload = {
        "title": "Temporary Event",
        "event_date": "2026-05-05T10:00:00Z",
        "location": "Building E",
        "maintenance_type": "Scheduled",
        "vendor_technician": "Tech B",
        "cost": 50.00,
    }
    create_res = client.post("/api/v1/maintenance-events/", json=create_payload)
    event_id = create_res.json()["id"]

    delete_res = client.delete(f"/api/v1/maintenance-events/{event_id}")
    assert delete_res.status_code == 204

    get_res = client.get(f"/api/v1/maintenance-events/{event_id}")
    assert get_res.status_code == 404


def test_filter_and_search_maintenance_events(client):
    event1 = {
        "title": "Urgent Fiber Repair",
        "event_date": "2026-01-15T08:00:00Z",
        "location": "Main Campus - East Wing",
        "maintenance_type": "Urgent Repair",
        "vendor_technician": "OpticLine Corp",
        "cost": 1200.00,
    }
    event2 = {
        "title": "Scheduled Firmware Update",
        "event_date": "2026-02-20T14:00:00Z",
        "location": "Main Campus - West Wing",
        "maintenance_type": "Firmware Upgrade",
        "vendor_technician": "Internal Admin",
        "cost": 0.00,
    }
    client.post("/api/v1/maintenance-events/", json=event1)
    client.post("/api/v1/maintenance-events/", json=event2)

    # Search filter
    res = client.get("/api/v1/maintenance-events/?search=Urgent")
    assert res.status_code == 200
    items = res.json()["items"]
    assert len(items) >= 1
    assert any(i["title"] == "Urgent Fiber Repair" for i in items)

    # Cost range filter
    res = client.get("/api/v1/maintenance-events/?min_cost=1000.00")
    assert res.status_code == 200
    items = res.json()["items"]
    assert len(items) >= 1
    assert all(i["cost"] >= 1000.00 for i in items)


def test_get_cost_summary(client):
    e1 = {
        "title": "Hardware Upgrade A",
        "event_date": "2026-05-10T10:00:00Z",
        "location": "Location Alpha",
        "maintenance_type": "Hardware Replacement",
        "vendor_technician": "Vendor A",
        "cost": 800.00,
    }
    e2 = {
        "title": "Scheduled Tuning B",
        "event_date": "2026-05-15T10:00:00Z",
        "location": "Location Alpha",
        "maintenance_type": "Scheduled",
        "vendor_technician": "Vendor B",
        "cost": 450.00,
    }
    client.post("/api/v1/maintenance-events/", json=e1)
    client.post("/api/v1/maintenance-events/", json=e2)

    res = client.get("/api/v1/maintenance-events/summary?location=Location%20Alpha")
    assert res.status_code == 200
    summary = res.json()
    assert summary["total_spend"] == 1250.00
    assert summary["total_events"] == 2
    assert summary["cost_by_type"]["Hardware Replacement"] == 800.00
    assert summary["cost_by_type"]["Scheduled"] == 450.00
    assert summary["cost_by_location"]["Location Alpha"] == 1250.00


def test_cost_summary_empty_state(client):
    res = client.get(
        "/api/v1/maintenance-events/summary?location=NonExistentLocation999"
    )
    assert res.status_code == 200
    summary = res.json()
    assert summary["total_spend"] == 0.0
    assert summary["total_events"] == 0
    assert summary["cost_by_type"] == {}
    assert summary["cost_by_location"] == {}
    assert summary["monthly_trends"] == []


def test_export_csv(client):
    res = client.get("/api/v1/maintenance-events/export")
    assert res.status_code == 200
    assert res.headers["content-type"].startswith("text/csv")
    csv_text = res.text
    assert "ID,Title,Event Date,Location" in csv_text
