import json
import pytest
from fastapi.testclient import TestClient

def test_create_chat(client: TestClient):
    # AC: Sidebar Navigation & Session Management - Create a new chat session
    response = client.post("/api/v1/chats", json={"title": "Test Chat"})
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["title"] == "Test Chat"

def test_list_chats(client: TestClient):
    # AC: Sidebar Navigation & Session Management - List all chat sessions
    client.post("/api/v1/chats", json={"title": "Chat 1"})
    client.post("/api/v1/chats", json={"title": "Chat 2"})
    
    response = client.get("/api/v1/chats")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    assert data[0]["title"] == "Chat 2"  # Sorted by updated_at desc

def test_get_chat_messages(client: TestClient):
    # AC: Conversation History Management - Retrieve all messages for a session
    chat_response = client.post("/api/v1/chats", json={"title": "Chat with Messages"})
    chat_id = chat_response.json()["id"]
    
    response = client.get(f"/api/v1/chats/{chat_id}/messages")
    assert response.status_code == 200
    assert response.json() == []

def test_send_message_and_stream(client: TestClient):
    # AC: Real-Time Streaming Responses - Send a new message and initiate the SSE stream
    chat_response = client.post("/api/v1/chats", json={"title": "New Chat"})
    chat_id = chat_response.json()["id"]
    
    response = client.post(f"/api/v1/chats/{chat_id}/messages", json={"content": "Explain quantum computing"})
    assert response.status_code == 200
    assert "text/event-stream" in response.headers["content-type"]
    
    # Read stream chunks
    chunks = []
    for line in response.iter_lines():
        if line.startswith("data: "):
            data_str = line[6:]
            data = json.loads(data_str)
            chunks.append(data)
            
    assert len(chunks) > 0
    assert any(c.get("done") is True for c in chunks)

def test_delete_chat(client: TestClient):
    # AC: Conversation History Management - Delete a chat session
    chat_response = client.post("/api/v1/chats", json={"title": "To Delete"})
    chat_id = chat_response.json()["id"]
    
    response = client.delete(f"/api/v1/chats/{chat_id}")
    assert response.status_code == 204
    
    # Verify it's deleted
    get_response = client.get("/api/v1/chats")
    assert not any(c["id"] == chat_id for c in get_response.json())

def test_rename_chat(client: TestClient):
    # AC: Sidebar Navigation & Session Management - Rename a chat session title
    chat_response = client.post("/api/v1/chats", json={"title": "Old Title"})
    chat_id = chat_response.json()["id"]
    
    response = client.patch(f"/api/v1/chats/{chat_id}", json={"title": "New Title"})
    assert response.status_code == 200
    assert response.json()["title"] == "New Title"
