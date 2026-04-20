from sqlalchemy.orm import Session
from backend.models import Account, Transaction
from backend.schemas import StatementRequest, Statement, Transaction as TransactionSchema
from datetime import datetime

class StatementService:
    def get_statement_data(self, db: Session, request: StatementRequest) -> Statement:
        account = db.query(Account).filter(Account.account_number == request.account_number).first()
        if not account:
            return None

        transactions = (
            db.query(Transaction)
            .filter(
                Transaction.account_id == account.id,
                Transaction.timestamp >= request.start_date,
                Transaction.timestamp <= request.end_date,
            )
            .order_by(Transaction.timestamp)
            .all()
        )

        opening_balance = account.opening_balance
        # In a real scenario, you'd calculate the opening balance based on transactions before the start_date

        closing_balance = opening_balance
        for t in transactions:
            if t.type == 'credit':
                closing_balance += t.amount
            else:
                closing_balance -= t.amount

        return Statement(
            account_number=account.account_number,
            start_date=request.start_date,
            end_date=request.end_date,
            opening_balance=opening_balance,
            closing_balance=closing_balance,
            transactions=[TransactionSchema.from_orm(t) for t in transactions]
        )
