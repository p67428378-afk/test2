import time
from server.services.password_service import DIGITS, LOWERCASE, SYMBOLS, UPPERCASE


def test_health_check(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "password-maker-service"
    assert "timestamp" in data


def test_default_password_generation(client):
    response = client.post("/api/v1/passwords/generate", json={})
    assert response.status_code == 200
    data = response.json()
    assert len(data["password"]) == 16
    assert data["length"] == 16
    assert data["entropy_bits"] > 90
    assert data["strength"] == "Very Strong"
    assert "generated_at" in data


def test_custom_password_length(client):
    for length in [8, 20, 32, 64, 128]:
        response = client.post("/api/v1/passwords/generate", json={"length": length})
        assert response.status_code == 200
        data = response.json()
        assert len(data["password"]) == length
        assert data["length"] == length


def test_length_validation_bounds(client):
    # Less than 8
    response_low = client.post("/api/v1/passwords/generate", json={"length": 7})
    assert response_low.status_code == 422

    # Greater than 128
    response_high = client.post("/api/v1/passwords/generate", json={"length": 129})
    assert response_high.status_code == 422


def test_character_set_uppercase_only(client):
    payload = {
        "length": 20,
        "include_uppercase": True,
        "include_lowercase": False,
        "include_digits": False,
        "include_symbols": False,
    }
    response = client.post("/api/v1/passwords/generate", json=payload)
    assert response.status_code == 200
    password = response.json()["password"]
    assert len(password) == 20
    assert all(c in UPPERCASE for c in password)


def test_character_set_lowercase_only(client):
    payload = {
        "length": 20,
        "include_uppercase": False,
        "include_lowercase": True,
        "include_digits": False,
        "include_symbols": False,
    }
    response = client.post("/api/v1/passwords/generate", json=payload)
    assert response.status_code == 200
    password = response.json()["password"]
    assert len(password) == 20
    assert all(c in LOWERCASE for c in password)


def test_character_set_digits_only(client):
    payload = {
        "length": 10,
        "include_uppercase": False,
        "include_lowercase": False,
        "include_digits": True,
        "include_symbols": False,
    }
    response = client.post("/api/v1/passwords/generate", json=payload)
    assert response.status_code == 200
    password = response.json()["password"]
    assert len(password) == 10
    assert all(c in DIGITS for c in password)


def test_character_set_symbols_only(client):
    payload = {
        "length": 15,
        "include_uppercase": False,
        "include_lowercase": False,
        "include_digits": False,
        "include_symbols": True,
    }
    response = client.post("/api/v1/passwords/generate", json=payload)
    assert response.status_code == 200
    password = response.json()["password"]
    assert len(password) == 15
    assert all(c in SYMBOLS for c in password)


def test_all_character_sets_included_guarantee(client):
    payload = {
        "length": 16,
        "include_uppercase": True,
        "include_lowercase": True,
        "include_digits": True,
        "include_symbols": True,
    }
    response = client.post("/api/v1/passwords/generate", json=payload)
    assert response.status_code == 200
    password = response.json()["password"]
    assert any(c in UPPERCASE for c in password)
    assert any(c in LOWERCASE for c in password)
    assert any(c in DIGITS for c in password)
    assert any(c in SYMBOLS for c in password)


def test_no_character_sets_selected_error(client):
    payload = {
        "length": 16,
        "include_uppercase": False,
        "include_lowercase": False,
        "include_digits": False,
        "include_symbols": False,
    }
    response = client.post("/api/v1/passwords/generate", json=payload)
    assert response.status_code in [400, 422]
    data = response.json()
    assert "detail" in data
    assert "At least one character set" in data["detail"]


def test_entropy_and_strength_ratings(client):
    # 8-char digits only -> Very Weak / Weak
    res1 = client.post(
        "/api/v1/passwords/generate",
        json={
            "length": 8,
            "include_uppercase": False,
            "include_lowercase": False,
            "include_digits": True,
            "include_symbols": False,
        },
    )
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["strength"] in ["Very Weak", "Weak"]

    # 16-char all sets -> Very Strong
    res2 = client.post(
        "/api/v1/passwords/generate",
        json={
            "length": 16,
            "include_uppercase": True,
            "include_lowercase": True,
            "include_digits": True,
            "include_symbols": True,
        },
    )
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["strength"] == "Very Strong"


def test_response_time_under_200ms(client):
    start = time.perf_counter()
    response = client.post("/api/v1/passwords/generate", json={"length": 32})
    elapsed = time.perf_counter() - start
    assert response.status_code == 200
    assert elapsed < 0.200  # < 200ms


def test_password_uniqueness(client):
    passwords = set()
    for _ in range(20):
        res = client.post("/api/v1/passwords/generate", json={"length": 16})
        assert res.status_code == 200
        passwords.add(res.json()["password"])
    assert len(passwords) == 20
