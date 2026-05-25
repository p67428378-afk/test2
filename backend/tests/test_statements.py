from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend.models import Account, Transaction
from datetime import datetime, timedelta

def test_read_root(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Bank Account Statement Generation Service"}

def test_generate_statement_pdf(client: TestClient, db_session: Session):
    # Create a test account
    account = Account(account_number="1234567890", opening_balance=1000.0)
    db_session.add(account)
    db_session.commit()
    db_session.refresh(account)

    # Create some test transactions
    t1 = Transaction(account_id=account.id, amount=200.0, type="debit", timestamp=datetime.utcnow() - timedelta(days=2))
    t2 = Transaction(account_id=account.id, amount=500.0, type="credit", timestamp=datetime.utcnow() - timedelta(days=1))
    db_session.add_all([t1, t2])
    db_session.commit()

    start_date = (datetime.utcnow() - timedelta(days=3)).isoformat()
    end_date = datetime.utcnow().isoformat()

    # The following is a placeholder for the actual API endpoint, which will be created in the implementation phase
    # response = client.post("/statements/pdf", json={
    #     "account_number": "1234567890",
    #     "start_date": start_date,
    #     "end_date": end_date
    # })
    # assert response.status_code == 200
    # assert response.headers["content-type"] == "application/pdf"
    pass # Remove this once the endpoint is implemented
