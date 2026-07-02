import uuid
from datetime import datetime, timedelta
from decimal import Decimal
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from server.models import Account, FDProduct, Transaction


def get_fd_products(db: Session):
    products = db.query(FDProduct).all()
    # Seed default products if none exist
    if not products:
        default_products = [
            FDProduct(
                id="11111111-1111-1111-1111-111111111111",
                name="Short Term Saver",
                tenure_months=6,
                interest_rate=Decimal("4.50"),
                min_deposit=Decimal("1000.00"),
                badge="Popular",
            ),
            FDProduct(
                id="22222222-2222-2222-2222-222222222222",
                name="Medium Term Growth",
                tenure_months=12,
                interest_rate=Decimal("5.25"),
                min_deposit=Decimal("2000.00"),
                badge="High Yield",
            ),
            FDProduct(
                id="33333333-3333-3333-3333-333333333333",
                name="Long Term Wealth",
                tenure_months=24,
                interest_rate=Decimal("6.00"),
                min_deposit=Decimal("5000.00"),
                badge="Best Value",
            ),
        ]
        for p in default_products:
            existing = db.query(FDProduct).filter(FDProduct.id == p.id).first()
            if not existing:
                db.add(p)
        db.commit()
        products = db.query(FDProduct).all()
    return products


def get_account_details(db: Session, account_id: str):
    account = db.query(Account).filter(Account.id == str(account_id)).first()
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Account not found"
        )
    return account


def create_fd_account(
    db: Session,
    product_id: str,
    source_account_id: str,
    deposit_amount: float,
    pin: str,
):
    # 1. Validate PIN (Simulated validation: pin must be "1234")
    if pin != "1234":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid PIN"
        )

    # 2. Fetch and validate product
    product = db.query(FDProduct).filter(FDProduct.id == str(product_id)).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )

    # 3. Validate minimum deposit
    if Decimal(str(deposit_amount)) < product.min_deposit:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Deposit amount is below the minimum required of {product.min_deposit}",
        )

    # 4. Fetch and validate source account
    source_account = (
        db.query(Account).filter(Account.id == str(source_account_id)).first()
    )
    if not source_account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Source account not found"
        )

    # 5. Validate sufficient funds
    if source_account.balance < Decimal(str(deposit_amount)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient funds in source account",
        )

    # 6. Perform atomic transaction
    try:
        # Deduct from source account
        source_account.balance -= Decimal(str(deposit_amount))

        # Create withdrawal transaction for source account
        withdrawal_tx = Transaction(
            id=str(uuid.uuid4()),
            account_id=source_account.id,
            amount=Decimal(str(deposit_amount)),
            transaction_type="WITHDRAWAL",
            status="COMPLETED",
        )
        db.add(withdrawal_tx)

        # Create new FD Account
        fd_account_number = f"FD-{uuid.uuid4().hex[:8].upper()}"
        fd_account = Account(
            id=str(uuid.uuid4()),
            customer_id=source_account.customer_id,
            account_number=fd_account_number,
            balance=Decimal(str(deposit_amount)),
            currency=source_account.currency,
            account_type="FD",
        )
        db.add(fd_account)
        db.flush()  # Get fd_account.id

        # Create deposit transaction for FD account
        deposit_tx = Transaction(
            id=str(uuid.uuid4()),
            account_id=fd_account.id,
            amount=Decimal(str(deposit_amount)),
            transaction_type="DEPOSIT",
            status="COMPLETED",
        )
        db.add(deposit_tx)

        # Commit transaction
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Core banking API failure or transaction rollback: {str(e)}",
        )

    # Calculate maturity details
    principal = Decimal(str(deposit_amount))
    rate = product.interest_rate / Decimal("100")
    time_years = Decimal(str(product.tenure_months)) / Decimal("12")

    # Simple interest calculation: A = P(1 + rt)
    maturity_amount = principal * (Decimal("1") + rate * time_years)
    maturity_date = (
        datetime.utcnow() + timedelta(days=product.tenure_months * 30)
    ).isoformat() + "Z"

    return {
        "fd_account_number": fd_account.account_number,
        "interest_rate": float(product.interest_rate),
        "maturity_amount": float(maturity_amount),
        "maturity_date": maturity_date,
        "principal_amount": float(principal),
        "status": "ACTIVE",
        "tenure_months": product.tenure_months,
    }
