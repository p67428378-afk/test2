import random
from sqlalchemy.orm import Session
from server.models.payment import Payment


class SettlementService:
    @staticmethod
    def execute_settlement(payment_id: str, network: str, db: Session) -> str:
        # Validate network
        valid_networks = ["SWIFT", "SEPA", "FEDNOW", "RTP"]
        if network.upper() not in valid_networks:
            return "Failed"

        # Simulate settlement network execution
        # 90% chance of success, 10% chance of failure
        if random.random() < 0.1:
            return "Failed"

        return "Settled"

    @staticmethod
    def reconcile_payment(payment_id: str, db: Session) -> bool:
        # Simulate auto-matching with accounting system
        payment = db.query(Payment).filter(Payment.payment_id == payment_id).first()
        if not payment:
            return False

        # If settled, auto-match with accounting system
        if payment.status == "Settled":
            # Mock reconciliation success
            return True

        return False
