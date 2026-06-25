import uuid
from decimal import Decimal
from sqlalchemy.orm import Session
from server import models

# Mock FX Rates
FX_RATES = {
    "EUR/USD": Decimal("1.0850"),
    "GBP/USD": Decimal("1.2720"),
    "JPY/USD": Decimal("0.0063"),
    "CAD/USD": Decimal("0.7350"),
    "USD/USD": Decimal("1.0000"),
}


def get_fx_rate(source_currency: str, target_currency: str) -> Decimal:
    pair = f"{source_currency.upper()}/{target_currency.upper()}"
    if source_currency.upper() == target_currency.upper():
        return Decimal("1.0000")
    return FX_RATES.get(pair, Decimal("1.0000"))


def execute_eod_sweeps(db: Session, region: str = None) -> dict:
    """
    Executes the end-of-day balance sweep process.
    - Fetches active sweep rules.
    - For each rule, checks if source balance > target_balance + sweep_threshold.
    - If yes, sweeps the excess (balance - target_balance) to the hub account.
    - Performs FX conversion to USD (hub currency).
    - Evaluates active hedging rules and triggers forward contracts if conditions are met.
    - Updates account balances and logs all activities.
    """
    transaction_id = uuid.uuid4()
    sweeps_executed = 0
    hedges_triggered = 0

    # Fetch active sweep rules
    # If region is specified, we can filter by bank_provider or source account name/provider
    query = db.query(models.SweepRule).filter(models.SweepRule.status == "ACTIVE")
    active_rules = query.all()

    for rule in active_rules:
        source_acc = (
            db.query(models.Account)
            .filter(models.Account.id == rule.source_account_id)
            .first()
        )
        hub_acc = (
            db.query(models.Account)
            .filter(models.Account.id == rule.hub_account_id)
            .first()
        )

        if not source_acc or not hub_acc:
            # Log failure
            log = models.ActivityLog(
                transaction_id=transaction_id,
                sweep_rule_id=rule.id,
                type="SWEEP",
                status="FAILED",
                details={"error": "Source or Hub account not found"},
            )
            db.add(log)
            db.commit()
            continue

        # If region is specified, filter by bank provider or name
        if (
            region
            and region.lower() not in source_acc.bank_provider.lower()
            and region.lower() not in source_acc.name.lower()
        ):
            continue

        source_balance = Decimal(str(source_acc.balance))
        target_balance = Decimal(str(rule.target_balance))
        sweep_threshold = Decimal(str(rule.sweep_threshold))

        # Check if sweep is triggered
        if source_balance > (target_balance + sweep_threshold):
            swept_amount = source_balance - target_balance

            # FX Conversion
            fx_rate = get_fx_rate(source_acc.currency, hub_acc.currency)
            converted_amount = swept_amount * fx_rate

            # Update balances
            source_acc.balance = float(source_balance - swept_amount)
            hub_acc.balance = float(Decimal(str(hub_acc.balance)) + converted_amount)

            # Log Sweep Activity
            sweep_log = models.ActivityLog(
                transaction_id=transaction_id,
                sweep_rule_id=rule.id,
                type="SWEEP",
                status="SUCCESS",
                amount=float(swept_amount),
                currency=source_acc.currency,
                fx_rate=float(fx_rate),
                converted_amount_usd=float(converted_amount),
                details={
                    "source_account_number": source_acc.account_number,
                    "hub_account_number": hub_acc.account_number,
                    "original_balance": float(source_balance),
                    "new_balance": float(source_acc.balance),
                },
            )
            db.add(sweep_log)
            db.commit()
            db.refresh(sweep_log)
            sweeps_executed += 1

            # Evaluate Hedging Rules
            # Currency pair is source_currency/hub_currency (e.g., EUR/USD)
            currency_pair = f"{source_acc.currency.upper()}/{hub_acc.currency.upper()}"
            hedge_rules = (
                db.query(models.HedgeRule)
                .filter(
                    models.HedgeRule.currency_pair == currency_pair,
                    models.HedgeRule.status == "ACTIVE",
                )
                .all()
            )

            for h_rule in hedge_rules:
                amount_threshold = Decimal(str(h_rule.amount_threshold))
                volatility_threshold = h_rule.volatility_threshold

                # Check if converted amount meets threshold
                # Volatility check: mock current volatility as 2.5%
                current_volatility = Decimal("2.50")

                volatility_ok = True
                if volatility_threshold is not None:
                    volatility_ok = current_volatility >= Decimal(
                        str(volatility_threshold)
                    )

                if converted_amount >= amount_threshold and volatility_ok:
                    # Trigger Forward Contract Hedge
                    hedge_log = models.ActivityLog(
                        transaction_id=transaction_id,
                        hedge_rule_id=h_rule.id,
                        type="HEDGE",
                        status="SUCCESS",
                        amount=float(converted_amount),
                        currency="USD",
                        details={
                            "currency_pair": currency_pair,
                            "forward_rate": float(fx_rate),
                            "contract_id": f"FWD-{uuid.uuid4().hex[:6].upper()}",
                            "current_volatility": float(current_volatility),
                            "volatility_threshold": float(volatility_threshold)
                            if volatility_threshold is not None
                            else None,
                        },
                    )
                    db.add(hedge_log)
                    db.commit()
                    hedges_triggered += 1

    return {
        "hedges_triggered": hedges_triggered,
        "status": "SUCCESS",
        "sweeps_executed": sweeps_executed,
        "transaction_id": transaction_id,
    }
