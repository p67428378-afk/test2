import uuid
from sqlalchemy.orm import Session
from server.models.risk import RiskLimit


class RiskService:
    @staticmethod
    def get_or_create_limit(currency: str, country: str, db: Session) -> RiskLimit:
        limit = (
            db.query(RiskLimit)
            .filter(
                RiskLimit.currency == currency.upper(),
                RiskLimit.country == country.upper(),
            )
            .first()
        )

        if not limit:
            # Create default limit
            limit = RiskLimit(
                limit_id=str(uuid.uuid4()),
                currency=currency.upper(),
                country=country.upper(),
                limit_amount=10000000.0,  # $10M exposure limit
                daily_cap=1000000.0,  # $1M daily cap
                weekly_cap=5000000.0,  # $5M weekly cap
                current_daily_usage=0.0,
                current_weekly_usage=0.0,
            )
            db.add(limit)
            db.commit()
            db.refresh(limit)

        return limit

    @staticmethod
    def validate_limits(
        amount: float, currency: str, country: str, db: Session
    ) -> tuple[bool, str]:
        limit = RiskService.get_or_create_limit(currency, country, db)

        # Check exposure limit
        if amount > float(limit.limit_amount):
            return (
                False,
                f"Transaction amount {amount} exceeds corporate exposure limit of {limit.limit_amount} for {currency}/{country}.",
            )

        # Check daily cap
        if float(limit.current_daily_usage) + amount > float(limit.daily_cap):
            return (
                False,
                f"Transaction amount {amount} exceeds daily cap of {limit.daily_cap} for {currency}/{country}.",
            )

        # Check weekly cap
        if float(limit.current_weekly_usage) + amount > float(limit.weekly_cap):
            return (
                False,
                f"Transaction amount {amount} exceeds weekly cap of {limit.weekly_cap} for {currency}/{country}.",
            )

        return True, "All risk limits validated successfully."

    @staticmethod
    def update_usage(amount: float, currency: str, country: str, db: Session):
        limit = RiskService.get_or_create_limit(currency, country, db)
        limit.current_daily_usage = float(limit.current_daily_usage) + amount
        limit.current_weekly_usage = float(limit.current_weekly_usage) + amount
        db.commit()
        db.refresh(limit)
