from fastapi import FastAPI
from server.api.v1.endpoints import password_reset, treasury
from server.database import Base, engine, SessionLocal
from server import models

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Apex Treasury & Password Reset API")

# Include routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(treasury.router, prefix="/api/v1", tags=["treasury"])


@app.on_event("startup")
def seed_data():
    db = SessionLocal()
    try:
        # Check if accounts already exist
        if db.query(models.Account).count() == 0:
            # Seed Hub Account (USD)
            hub_acc = models.Account(
                name="USD Central Hub",
                account_number="HUB-USD-001",
                currency="USD",
                balance=5000000.00,
                bank_provider="JPMorgan Chase",
                is_hub=True,
            )
            db.add(hub_acc)
            db.flush()

            # Seed Operating Accounts
            eur_acc = models.Account(
                name="EUR Operating (Germany)",
                account_number="OP-EUR-002",
                currency="EUR",
                balance=1500000.00,
                bank_provider="Deutsche Bank",
                is_hub=False,
            )
            gbp_acc = models.Account(
                name="GBP Operating (UK)",
                account_number="OP-GBP-003",
                currency="GBP",
                balance=800000.00,
                bank_provider="Barclays",
                is_hub=False,
            )
            jpy_acc = models.Account(
                name="JPY Operating (Japan)",
                account_number="OP-JPY-004",
                currency="JPY",
                balance=250000000.00,
                bank_provider="MUFG",
                is_hub=False,
            )
            cad_acc = models.Account(
                name="CAD Operating (Canada)",
                account_number="OP-CAD-005",
                currency="CAD",
                balance=600000.00,
                bank_provider="RBC",
                is_hub=False,
            )
            db.add_all([eur_acc, gbp_acc, jpy_acc, cad_acc])
            db.flush()

            # Seed Sweep Rules
            eur_rule = models.SweepRule(
                source_account_id=eur_acc.id,
                hub_account_id=hub_acc.id,
                target_balance=200000.00,
                sweep_threshold=50000.00,
                schedule="0 18 * * 1-5",
                status="ACTIVE",
            )
            gbp_rule = models.SweepRule(
                source_account_id=gbp_acc.id,
                hub_account_id=hub_acc.id,
                target_balance=150000.00,
                sweep_threshold=30000.00,
                schedule="0 18 * * 1-5",
                status="ACTIVE",
            )
            jpy_rule = models.SweepRule(
                source_account_id=jpy_acc.id,
                hub_account_id=hub_acc.id,
                target_balance=50000000.00,
                sweep_threshold=10000000.00,
                schedule="0 18 * * 1-5",
                status="ACTIVE",
            )
            cad_rule = models.SweepRule(
                source_account_id=cad_acc.id,
                hub_account_id=hub_acc.id,
                target_balance=100000.00,
                sweep_threshold=20000.00,
                schedule="0 18 * * 1-5",
                status="ACTIVE",
            )
            db.add_all([eur_rule, gbp_rule, jpy_rule, cad_rule])
            db.flush()

            # Seed Hedge Rules
            eur_hedge = models.HedgeRule(
                currency_pair="EUR/USD",
                amount_threshold=500000.00,
                volatility_threshold=1.50,
                status="ACTIVE",
            )
            jpy_hedge = models.HedgeRule(
                currency_pair="JPY/USD",
                amount_threshold=1000000.00,
                volatility_threshold=2.00,
                status="ACTIVE",
            )
            db.add_all([eur_hedge, jpy_hedge])
            db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "Welcome to the Apex Treasury & Password Reset API"}
