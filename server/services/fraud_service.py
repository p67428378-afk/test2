import uuid
from sqlalchemy.orm import Session
from server.models.fraud import FraudScore
from server.config import settings


class FraudService:
    @staticmethod
    def analyze_fraud(
        payment_id: str,
        amount: float,
        beneficiary_name: str,
        currency: str,
        destination_country: str,
        db: Session,
    ) -> FraudScore:
        # Simulate ML model anomaly detection (unusually high amount, destination, frequency)
        score = 0.1
        details_list = []

        # Unusual amount rule
        if amount > 500000:
            score += 0.4
            details_list.append("Unusually high transaction amount.")

        # Unusual destination rule
        unusual_destinations = ["KP", "IR", "SY", "CU", "RU", "VE"]
        if destination_country.upper() in unusual_destinations:
            score += 0.3
            details_list.append(f"Unusual destination country: {destination_country}.")

        # Unusual frequency rule (mocked)
        if beneficiary_name.upper() == "SUSPICIOUS CORP":
            score += 0.5
            details_list.append("High frequency of transactions to this beneficiary.")

        # Cap score at 1.0
        score = min(score, 1.0)

        # Determine status based on threshold
        if score > settings.FRAUD_THRESHOLD:
            status = "Failed"
        elif score >= 0.5:
            status = "Manual Review"
        else:
            status = "Passed"

        details = (
            "; ".join(details_list) if details_list else "No fraud anomalies detected."
        )

        fraud_score = FraudScore(
            score_id=str(uuid.uuid4()),
            payment_id=payment_id,
            score=score,
            status=status,
            details=details,
        )

        db.add(fraud_score)
        db.commit()
        db.refresh(fraud_score)
        return fraud_score
