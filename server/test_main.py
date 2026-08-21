"""
Module: server.test_main
Purpose: Unit and integration tests for FastAPI endpoints
Author: Backend Developer Agent
Created: 2026-08-21
"""

import json
from fastapi import status


def test_health_check(client):
    """
    Test health check endpoint.
    """
    response = client.get("/health")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] == "healthy"


def test_create_chat_session(client):
    # AC: Users must be able to create new chat sessions
    response = client.post("/api/v1/chats", json={})
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert "id" in data
    assert data["title"] == "New Chat"


def test_create_chat_session_with_title(client):
    # AC: Users must be able to create new chat sessions with a custom title
    response = client.post("/api/v1/chats", json={"title": "Custom Title"})
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["title"] == "Custom Title"


def test_list_chats_pagination_and_sorting(client):
    # AC: Sidebar must list all past chat sessions sorted by the most recent activity
    # Create three chat sessions
    chat1 = client.post("/api/v1/chats", json={"title": "Chat 1"}).json()
    chat2 = client.post("/api/v1/chats", json={"title": "Chat 2"}).json()
    chat3 = client.post("/api/v1/chats", json={"title": "Chat 3"}).json()

    # List chats with pagination
    response = client.get("/api/v1/chats?skip=0&limit=2")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == 2
    # Sorted by updated_at desc, so chat3 and chat2 should be returned first
    assert data[0]["id"] == chat3["id"]
    assert data[1]["id"] == chat2["id"]


def test_get_chat_messages_not_found(client):
    # AC: Retrieve past sessions - 404 for non-existent session
    response = client.get("/api/v1/chats/non-existent-id/messages")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_rename_chat_session(client):
    # AC: Users must be able to rename session titles
    chat = client.post("/api/v1/chats", json={"title": "Old Title"}).json()
    chat_id = chat["id"]

    response = client.patch(f"/api/v1/chats/{chat_id}", json={"title": "New Title"})
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["title"] == "New Title"


def test_delete_chat_session_cascading(client):
    # AC: Deleting a session must perform a cascading delete of all associated messages
    chat = client.post("/api/v1/chats", json={"title": "To Delete"}).json()
    chat_id = chat["id"]

    # Send a message to create a message entry
    client.post(f"/api/v1/chats/{chat_id}/messages", json={"content": "Hello"})

    # Delete the chat session
    response = client.delete(f"/api/v1/chats/{chat_id}")
    assert response.status_code == status.HTTP_204_NO_CONTENT

    # Verify chat session is gone
    get_chat_response = client.get(f"/api/v1/chats/{chat_id}/messages")
    assert get_chat_response.status_code == status.HTTP_404_NOT_FOUND


def test_send_message_and_stream_sse(client):
    # AC: Real-time streaming of AI responses using Server-Sent Events (SSE)
    chat = client.post("/api/v1/chats", json={"title": "New Chat"}).json()
    chat_id = chat["id"]

    # Send message and read SSE stream
    response = client.post(
        f"/api/v1/chats/{chat_id}/messages",
        json={"content": "Explain quantum computing"},
    )
    assert response.status_code == status.HTTP_200_OK
    assert "text/event-stream" in response.headers["content-type"]

    # Read stream content
    lines = response.text.split("\n")
    chunks = []
    for line in lines:
        if line.startswith("data: "):
            data_str = line[6:]
            data_json = json.loads(data_str)
            if "content" in data_json:
                chunks.append(data_json["content"])

    assert len(chunks) > 0
    full_response = "".join(chunks)
    assert "quantum" in full_response.lower()

    # Verify user and assistant messages are saved in the database
    messages_response = client.get(f"/api/v1/chats/{chat_id}/messages")
    assert messages_response.status_code == status.HTTP_200_OK
    messages = messages_response.json()
    assert len(messages) == 2
    assert messages[0]["role"] == "user"
    assert messages[0]["content"] == "Explain quantum computing"
    assert messages[1]["role"] == "assistant"
    assert messages[1]["content"] == full_response


def test_send_message_auto_rename_chat(client):
    # AC: Sidebar entry must display a title defaulting to the first few words of the first user message
    chat = client.post("/api/v1/chats", json={"title": "New Chat"}).json()
    chat_id = chat["id"]

    # Send first message
    client.post(
        f"/api/v1/chats/{chat_id}/messages",
        json={"content": "What is the capital of France?"},
    )

    # Verify chat title is updated
    chats_response = client.get("/api/v1/chats")
    chats = chats_response.json()
    active_chat = next(c for c in chats if c["id"] == chat_id)
    assert active_chat["title"] == "What is the capital of"
