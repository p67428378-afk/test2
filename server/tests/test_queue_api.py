"""Unit and integration tests for Queue Management APIs."""

from fastapi.testclient import TestClient


def test_health_check(client: TestClient):
    """Test health check endpoints."""
    res1 = client.get("/health")
    assert res1.status_code == 200
    assert res1.json()["status"] == "ok"

    res2 = client.get("/api/v1/queue/health")
    assert res2.status_code == 200
    assert res2.json()["status"] == "ok"


def test_join_queue_success(client: TestClient):
    """Test joining queue creates sequential ticket number and position."""
    payload = {
        "customer_name": "Alice Smith",
        "service_type": "Customer Service",
    }
    response = client.post("/api/v1/queue/tickets", json=payload)
    assert response.status_code == 201
    data = response.json()

    assert data["customer_name"] == "Alice Smith"
    assert data["service_type"] == "Customer Service"
    assert data["status"] == "Waiting"
    assert data["ticket_number"] == "Q-101"
    assert data["position_in_line"] == 1
    assert data["estimated_wait_minutes"] == 5
    assert "ticket_id" in data


def test_join_queue_sequential_numbering(client: TestClient):
    """Test multiple users joining queue get sequential ticket numbers and positions."""
    res1 = client.post(
        "/api/v1/queue/tickets",
        json={"customer_name": "User 1", "service_type": "Billing"},
    )
    assert res1.status_code == 201
    t1 = res1.json()

    res2 = client.post(
        "/api/v1/queue/tickets",
        json={"customer_name": "User 2", "service_type": "Support"},
    )
    assert res2.status_code == 201
    t2 = res2.json()

    assert t1["ticket_number"] == "Q-101"
    assert t1["position_in_line"] == 1
    assert t1["estimated_wait_minutes"] == 5

    assert t2["ticket_number"] == "Q-102"
    assert t2["position_in_line"] == 2
    assert t2["estimated_wait_minutes"] == 10


def test_join_queue_validation_error(client: TestClient):
    """Test invalid payloads return 422 error."""
    # Blank customer name
    res1 = client.post(
        "/api/v1/queue/tickets",
        json={"customer_name": "   ", "service_type": "Support"},
    )
    assert res1.status_code == 422

    # Missing service type
    res2 = client.post("/api/v1/queue/tickets", json={"customer_name": "Bob"})
    assert res2.status_code == 422


def test_get_ticket_by_id_and_number(client: TestClient):
    """Test fetching ticket status by ID or ticket number."""
    create_res = client.post(
        "/api/v1/queue/tickets",
        json={"customer_name": "Charlie", "service_type": "General"},
    )
    ticket_id = create_res.json()["ticket_id"]
    ticket_num = create_res.json()["ticket_number"]

    # Fetch by UUID ID
    res_id = client.get(f"/api/v1/queue/tickets/{ticket_id}")
    assert res_id.status_code == 200
    assert res_id.json()["customer_name"] == "Charlie"

    # Fetch by human readable ticket number Q-101
    res_num = client.get(f"/api/v1/queue/tickets/{ticket_num}")
    assert res_num.status_code == 200
    assert res_num.json()["ticket_id"] == ticket_id


def test_get_ticket_not_found(client: TestClient):
    """Test fetching non-existent ticket returns 404."""
    res = client.get("/api/v1/queue/tickets/non-existent-uuid")
    assert res.status_code == 404
    assert "not found" in res.json()["detail"].lower()


def test_list_queue_tickets_and_filtering(client: TestClient):
    """Test listing queue tickets with status filtering and pagination."""
    client.post(
        "/api/v1/queue/tickets",
        json={"customer_name": "User A", "service_type": "Tech"},
    )
    client.post(
        "/api/v1/queue/tickets",
        json={"customer_name": "User B", "service_type": "Sales"},
    )

    # List all
    res_all = client.get("/api/v1/queue/tickets")
    assert res_all.status_code == 200
    data_all = res_all.json()
    assert data_all["total"] == 2
    assert len(data_all["items"]) == 2

    # Filter by Waiting
    res_waiting = client.get("/api/v1/queue/tickets?status=Waiting")
    assert res_waiting.status_code == 200
    assert res_waiting.json()["total"] == 2

    # Filter by In Progress (empty)
    res_in_prog = client.get("/api/v1/queue/tickets?status=In Progress")
    assert res_in_prog.status_code == 200
    assert res_in_prog.json()["total"] == 0


def test_status_transitions_and_position_advancement(client: TestClient):
    """Test ticket status updates and position auto-advancement for downstream tickets."""
    # Create 3 tickets
    t1 = client.post(
        "/api/v1/queue/tickets",
        json={"customer_name": "First", "service_type": "Service"},
    ).json()
    t2 = client.post(
        "/api/v1/queue/tickets",
        json={"customer_name": "Second", "service_type": "Service"},
    ).json()
    t3 = client.post(
        "/api/v1/queue/tickets",
        json={"customer_name": "Third", "service_type": "Service"},
    ).json()

    assert t1["position_in_line"] == 1
    assert t2["position_in_line"] == 2
    assert t3["position_in_line"] == 3

    # Call First ticket to counter (Waiting -> In Progress)
    patch_res = client.patch(
        f"/api/v1/queue/tickets/{t1['ticket_id']}/status",
        json={"status": "In Progress", "counter_number": "Counter 3"},
    )
    assert patch_res.status_code == 200
    updated_t1 = patch_res.json()
    assert updated_t1["status"] == "In Progress"
    assert updated_t1["counter_number"] == "Counter 3"
    assert updated_t1["position_in_line"] == 0
    assert updated_t1["estimated_wait_minutes"] == 0

    # Check that t2 and t3 positions automatically advanced
    check_t2 = client.get(f"/api/v1/queue/tickets/{t2['ticket_id']}").json()
    check_t3 = client.get(f"/api/v1/queue/tickets/{t3['ticket_id']}").json()

    assert check_t2["position_in_line"] == 1
    assert check_t2["estimated_wait_minutes"] == 5

    assert check_t3["position_in_line"] == 2
    assert check_t3["estimated_wait_minutes"] == 10

    # Complete First ticket (In Progress -> Completed)
    comp_res = client.patch(
        f"/api/v1/queue/tickets/{t1['ticket_id']}/status",
        json={"status": "Completed"},
    )
    assert comp_res.status_code == 200
    assert comp_res.json()["status"] == "Completed"

    # Cancel Second ticket (Waiting -> Cancelled)
    cancel_res = client.patch(
        f"/api/v1/queue/tickets/{t2['ticket_id']}/status",
        json={"status": "Cancelled"},
    )
    assert cancel_res.status_code == 200
    assert cancel_res.json()["status"] == "Cancelled"

    # t3 should now be at position 1
    check_t3_after_cancel = client.get(
        f"/api/v1/queue/tickets/{t3['ticket_id']}"
    ).json()
    assert check_t3_after_cancel["position_in_line"] == 1
    assert check_t3_after_cancel["estimated_wait_minutes"] == 5


def test_invalid_status_transition(client: TestClient):
    """Test invalid status state transition returns 400 Bad Request."""
    t1 = client.post(
        "/api/v1/queue/tickets",
        json={"customer_name": "Test User", "service_type": "Service"},
    ).json()

    # Move to In Progress
    client.patch(
        f"/api/v1/queue/tickets/{t1['ticket_id']}/status",
        json={"status": "In Progress"},
    )
    # Move to Completed
    client.patch(
        f"/api/v1/queue/tickets/{t1['ticket_id']}/status", json={"status": "Completed"}
    )

    # Try moving Completed -> Waiting (Invalid!)
    invalid_patch = client.patch(
        f"/api/v1/queue/tickets/{t1['ticket_id']}/status",
        json={"status": "Waiting"},
    )
    assert invalid_patch.status_code == 400
    assert "cannot transition" in invalid_patch.json()["detail"].lower()
