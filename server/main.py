from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import uuid

from server.api.v1.endpoints import password_reset, accounts, audit
from server.database import Base, engine, SessionLocal
from server import models

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed database on startup
def seed_db():
    db = SessionLocal()
    try:
        # Check if test user already exists
        user_id = uuid.UUID("11111111-1111-1111-1111-111111111111")
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            user = models.User(
                id=user_id,
                login_id="user1",
                mobile_number="1234567890",
                hashed_password="password123",
                security_question="What is your pet's name?",
                security_answer_hash="hashed_answer"
            )
            db.add(user)
            db.commit()
            
            # Create accounts
            active_account = models.Account(
                id=uuid.UUID("22222222-2222-2222-2222-222222222222"),
                user_id=user_id,
                account_number="123456789012",
                ledger_balance=124500.00,
                available_balance=118200.00,
                currency="INR",
                daily_transaction_limit=500000.00,
                remaining_daily_limit=450000.00,
                status="ACTIVE",
                reason_code=None
            )
            frozen_account = models.Account(
                id=uuid.UUID("33333333-3333-3333-3333-333333333333"),
                user_id=user_id,
                account_number="987654321098",
                ledger_balance=0.00,
                available_balance=0.00,
                currency="INR",
                daily_transaction_limit=5000.00,
                remaining_daily_limit=5000.00,
                status="FROZEN",
                reason_code="ACC_FROZEN"
            )
            dormant_account = models.Account(
                id=uuid.UUID("44444444-4444-4444-4444-444444444444"),
                user_id=user_id,
                account_number="567890123456",
                ledger_balance=45200.00,
                available_balance=45200.00,
                currency="INR",
                daily_transaction_limit=5000.00,
                remaining_daily_limit=5000.00,
                status="DORMANT",
                reason_code="ACC_DORMANT"
            )
            db.add(active_account)
            db.add(frozen_account)
            db.add(dormant_account)
            db.commit()
            
            # Create transactions
            tx1 = models.Transaction(
                id=uuid.UUID("55555555-5555-5555-5555-555555555555"),
                account_id=active_account.id,
                amount=10000.00,
                type="CREDIT",
                description="Salary credit"
            )
            tx2 = models.Transaction(
                id=uuid.UUID("66666666-6666-6666-6666-666666666666"),
                account_id=active_account.id,
                amount=1800.00,
                type="DEBIT",
                description="Electricity bill payment"
            )
            tx3 = models.Transaction(
                id=uuid.UUID("77777777-7777-7777-7777-777777777777"),
                account_id=active_account.id,
                amount=4500.00,
                type="DEBIT",
                description="Online shopping"
            )
            db.add(tx1)
            db.add(tx2)
            db.add(tx3)
            db.commit()
            
            # Create audit logs
            log1 = models.AuditLog(
                id=uuid.UUID("88888888-8888-8888-8888-888888888888"),
                user_id=user_id,
                account_id=active_account.id,
                event_type="BALANCE_INQUIRY",
                details="Balance inquiry for account 123456789012. Status: ACTIVE, Reason: None"
            )
            log2 = models.AuditLog(
                id=uuid.UUID("99999999-9999-9999-9999-999999999999"),
                user_id=user_id,
                account_id=active_account.id,
                event_type="SESSION_START",
                details="User session started successfully"
            )
            db.add(log1)
            db.add(log2)
            db.commit()
    finally:
        db.close()

seed_db()

class LoginRequest(BaseModel):
    login_id: str
    password: str

@app.post("/api/v1/auth/login")
def login(request: LoginRequest, db: Session = Depends(SessionLocal)):
    user = db.query(models.User).filter(models.User.login_id == request.login_id).first()
    if not user or user.hashed_password != request.password:
        raise HTTPException(status_code=401, detail="Invalid login ID or password")
    return {
        "token": f"valid-token-{str(user.id)}",
        "user": {
            "id": str(user.id),
            "login_id": user.login_id,
            "mobile_number": user.mobile_number
        }
    }

# Add an endpoint to get user's accounts
@app.get("/api/v1/accounts")
def get_user_accounts(db: Session = Depends(SessionLocal), authorization: str = None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    token = authorization.split(" ")[1]
    if token.startswith("valid-token-"):
        user_id_str = token.replace("valid-token-", "")
        user_id = uuid.UUID(user_id_str)
        accounts = db.query(models.Account).filter(models.Account.user_id == user_id).all()
        return {
            "accounts": [
                {
                    "id": str(acc.id),
                    "accountNumber": acc.account_number,
                    "status": acc.status,
                    "currency": acc.currency
                } for acc in accounts
            ]
        }
    raise HTTPException(status_code=401, detail="Invalid session token")

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(accounts.router, prefix="/api/v1", tags=["accounts"])
app.include_router(audit.router, prefix="/api/v1", tags=["audit"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Retail Banking Core System API"}
