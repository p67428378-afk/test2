import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from server.models.compliance import ComplianceCheck
from server.models.payment import Payment


class ComplianceService:
    @staticmethod
    def run_checks(
        payment_id: str,
        amount: float,
        beneficiary_name: str,
        currency: str,
        destination_country: str,
        db: Session,
    ) -> ComplianceCheck:
        # Screen against global sanction lists (OFAC, UN, EU)
        # Mock sanction list check: block specific names or countries
        sanctioned_names = ["SANCTIONED CORP", "TERRORIST INC", "BAD ACTOR"]
        sanctioned_countries = [
            "KP",
            "IR",
            "SY",
            "CU",
        ]  # North Korea, Iran, Syria, Cuba

        sanction_screen_status = "Passed"
        details_list = []

        if beneficiary_name.upper() in sanctioned_names:
            sanction_screen_status = "Failed"
            details_list.append(
                f"Beneficiary '{beneficiary_name}' matches global sanction list."
            )

        if destination_country.upper() in sanctioned_countries:
            sanction_screen_status = "Failed"
            details_list.append(
                f"Destination country '{destination_country}' is sanctioned."
            )

        # Calculate risk score based on destination country, amount, and history
        # High risk countries
        high_risk_countries = ["RU", "VE", "SO", "AF"]
        country_risk = (
            0.5 if destination_country.upper() in high_risk_countries else 0.1
        )

        # Amount risk
        amount_risk = min(amount / 1000000.0, 0.4)  # Max 0.4 risk from amount

        # History risk (mocked based on beneficiary name length or random)
        history_risk = 0.1

        risk_score = country_risk + amount_risk + history_risk

        # Overall status
        if sanction_screen_status == "Failed":
            status = "Failed"
        elif risk_score > 0.75:
            status = "Failed"
            details_list.append(f"Risk score {risk_score:.2f} exceeds threshold.")
        else:
            status = "Passed"

        details = (
            "; ".join(details_list) if details_list else "All compliance checks passed."
        )

        compliance_check = ComplianceCheck(
            check_id=str(uuid.uuid4()),
            payment_id=payment_id,
            status=status,
            sanction_screen_status=sanction_screen_status,
            risk_score=risk_score,
            details=details,
        )

        db.add(compliance_check)
        db.commit()
        db.refresh(compliance_check)
        return compliance_check

    @staticmethod
    def generate_regulatory_report(
        start_date: datetime, end_date: datetime, format: str, db: Session
    ) -> dict:
        # Fetch payments in date range
        payments = (
            db.query(Payment)
            .filter(Payment.created_at >= start_date, Payment.created_at <= end_date)
            .all()
        )

        report_id = str(uuid.uuid4())
        generated_at = datetime.now(timezone.utc)
        download_url = f"https://bfsi-na-ai-engineering-v3.atlassian.net/reports/{report_id}.{format}"

        return {
            "report_id": report_id,
            "generated_at": generated_at,
            "download_url": download_url,
            "payments_count": len(payments),
        }
