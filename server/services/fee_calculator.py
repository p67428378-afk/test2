import math
from datetime import datetime, timezone


def calculate_rental_duration_days(start_date: datetime, end_date: datetime) -> int:
    """Calculate duration in full days (minimum 1 day)."""
    seconds = (end_date - start_date).total_seconds()
    if seconds <= 0:
        return 1
    days = math.ceil(seconds / 86400.0)
    return max(1, days)


def calculate_rental_fee(
    start_date: datetime, end_date: datetime, daily_rate: float
) -> float:
    days = calculate_rental_duration_days(start_date, end_date)
    return round(days * daily_rate, 2)


def calculate_preauth_amount(rental_fee: float, deposit_amount: float) -> float:
    return round(rental_fee + deposit_amount, 2)


def calculate_return_settlement(
    start_date: datetime,
    end_date: datetime,
    actual_return_date: datetime,
    daily_rate: float,
    deposit_amount: float,
    damage_assessment: float = 0.0,
) -> dict:
    """
    Calculate return check-in settlement including late fees and deposit refunds/charges.
    """
    # Normalize timezones to UTC if naive
    if start_date.tzinfo is None:
        start_date = start_date.replace(tzinfo=timezone.utc)
    if end_date.tzinfo is None:
        end_date = end_date.replace(tzinfo=timezone.utc)
    if actual_return_date.tzinfo is None:
        actual_return_date = actual_return_date.replace(tzinfo=timezone.utc)

    days_rented = calculate_rental_duration_days(start_date, end_date)
    rental_fee = round(days_rented * daily_rate, 2)

    # Calculate late days
    if actual_return_date > end_date:
        seconds_late = (actual_return_date - end_date).total_seconds()
        days_late = math.ceil(seconds_late / 86400.0)
    else:
        days_late = 0

    late_fee = round(days_late * daily_rate, 2)
    total_deductions = round(late_fee + damage_assessment, 2)

    if total_deductions <= deposit_amount:
        refund_amount = round(deposit_amount - total_deductions, 2)
        excess_charged = 0.0
    else:
        refund_amount = 0.0
        excess_charged = round(total_deductions - deposit_amount, 2)

    return {
        "days_rented": days_rented,
        "days_late": days_late,
        "rental_fee": rental_fee,
        "deposit_amount": round(deposit_amount, 2),
        "late_fee": late_fee,
        "damage_assessment": round(damage_assessment, 2),
        "total_deductions": total_deductions,
        "refund_amount": refund_amount,
        "excess_charged": excess_charged,
    }
