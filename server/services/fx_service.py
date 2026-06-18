import uuid
import random
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from server.models.fx_rate import FXRate
from server.config import settings


class FXService:
    @staticmethod
    def fetch_rates(
        source_currency: str, target_currency: str, amount: float, db: Session
    ) -> FXRate:
        # Try multiple providers (Swissquote, Rada Forex, etc.)
        providers = settings.LIQUIDITY_PROVIDERS

        # Simulate provider availability and fallback
        selected_provider = None
        base_rate = 1.0

        for provider in providers:
            try:
                # Simulate 10% chance of provider failure to demonstrate fallback
                if random.random() < 0.1:
                    raise Exception(f"Provider {provider} is down")

                selected_provider = provider
                # Generate a realistic base rate
                if source_currency == "USD" and target_currency == "EUR":
                    base_rate = 0.92
                elif source_currency == "EUR" and target_currency == "USD":
                    base_rate = 1.08
                elif source_currency == "USD" and target_currency == "GBP":
                    base_rate = 0.79
                elif source_currency == "GBP" and target_currency == "USD":
                    base_rate = 1.26
                else:
                    base_rate = 1.0 + (random.random() - 0.5) * 0.2
                break
            except Exception:
                continue

        if not selected_provider:
            # Fallback to a guaranteed provider if all failed
            selected_provider = "Guaranteed Fallback Provider"
            base_rate = 1.0

        # Calculate spread and fees
        spread = 0.002  # 0.2% spread
        bid_rate = base_rate - (spread / 2)
        ask_rate = base_rate + (spread / 2)

        fee = amount * 0.001  # 0.1% fee

        # Lock rate for 30 seconds
        expires_at = datetime.now(timezone.utc) + timedelta(seconds=30)

        fx_rate = FXRate(
            rate_id=str(uuid.uuid4()),
            source_currency=source_currency,
            target_currency=target_currency,
            base_rate=base_rate,
            bid_rate=bid_rate,
            ask_rate=ask_rate,
            spread=spread,
            fee=fee,
            provider=selected_provider,
            expires_at=expires_at,
        )

        db.add(fx_rate)
        db.commit()
        db.refresh(fx_rate)
        return fx_rate

    @staticmethod
    def validate_rate_lock(rate_lock_id: str, db: Session) -> FXRate:
        fx_rate = db.query(FXRate).filter(FXRate.rate_id == rate_lock_id).first()
        if not fx_rate:
            return None

        # Check expiration
        if datetime.now(timezone.utc) > fx_rate.expires_at.replace(tzinfo=timezone.utc):
            return None

        return fx_rate
