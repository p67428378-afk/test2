import uuid
from fastapi.testclient import TestClient


def test_get_module_quizzes_success(client: TestClient):
    # Retrieve Physiology module
    modules_resp = client.get("/api/v1/modules?subject=physiology")
    physio_mod = modules_resp.json()[0]

    quiz_resp = client.get(f"/api/v1/quizzes/module/{physio_mod['id']}")
    assert quiz_resp.status_code == 200
    checkpoints = quiz_resp.json()
    assert isinstance(checkpoints, list)
    assert len(checkpoints) >= 3

    first_cp = checkpoints[0]
    assert "timestamp_seconds" in first_cp
    assert "question_text" in first_cp
    assert "options" in first_cp
    assert isinstance(first_cp["options"], list)
    assert len(first_cp["options"]) >= 2
    assert "correct_option" in first_cp


def test_get_module_quizzes_not_found(client: TestClient):
    random_uuid = str(uuid.uuid4())
    resp = client.get(f"/api/v1/quizzes/module/{random_uuid}")
    assert resp.status_code == 404


def test_get_module_quizzes_invalid_uuid(client: TestClient):
    resp = client.get("/api/v1/quizzes/module/bad-uuid-format")
    assert resp.status_code == 422


def test_evaluate_checkpoint_answer(client: TestClient):
    # Get a checkpoint ID from Physiology module
    modules_resp = client.get("/api/v1/modules?subject=physiology")
    physio_mod = modules_resp.json()[0]
    quiz_resp = client.get(f"/api/v1/quizzes/module/{physio_mod['id']}")
    first_cp = quiz_resp.json()[0]
    cp_id = first_cp["id"]
    correct_idx = first_cp["correct_option"]

    # Test correct answer
    eval_resp_correct = client.post(
        "/api/v1/quizzes/evaluate",
        json={"checkpoint_id": cp_id, "selected_option": correct_idx},
    )
    assert eval_resp_correct.status_code == 200
    assert eval_resp_correct.json()["is_correct"] is True

    # Test incorrect answer
    wrong_idx = (correct_idx + 1) % len(first_cp["options"])
    eval_resp_wrong = client.post(
        "/api/v1/quizzes/evaluate",
        json={"checkpoint_id": cp_id, "selected_option": wrong_idx},
    )
    assert eval_resp_wrong.status_code == 200
    assert eval_resp_wrong.json()["is_correct"] is False


def test_create_checkpoint(client: TestClient):
    modules_resp = client.get("/api/v1/modules?subject=biochemistry")
    biochem_mod = modules_resp.json()[0]

    new_cp_resp = client.post(
        "/api/v1/quizzes/checkpoints",
        json={
            "module_id": biochem_mod["id"],
            "timestamp_seconds": 180.0,
            "question_text": "Which metabolic intermediate links glycolysis to the citric acid cycle?",
            "options": ["Oxaloacetate", "Acetyl-CoA", "Citrate", "Succinate"],
            "correct_option": 1,
        },
    )
    assert new_cp_resp.status_code == 201
    created_cp = new_cp_resp.json()
    assert created_cp["timestamp_seconds"] == 180.0
    assert created_cp["correct_option"] == 1
