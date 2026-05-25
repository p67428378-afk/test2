from typing import Dict, Any

def calculate_premium_logic(
    base_rate: float,
    ncb_tier: str,
    vehicle_multiplier: float
) -> Dict[str, Any]:
    ncb_discounts = {
        "No NCB": 0.0,
        "Tier 1": 0.20,
        "Tier 2": 0.25,
        "Tier 3": 0.30,
        "Tier 4": 0.40,
        "Tier 5": 0.50,
    }

    ncb_discount_percentage = ncb_discounts.get(ncb_tier)

    if ncb_discount_percentage is None or ncb_discount_percentage > 0.50:
        ncb_discount_percentage = 0.50

    premium_after_ncb = base_rate * (1 - ncb_discount_percentage)

    # Apply vehicle multiplier, ensuring it's within bounds
    effective_vehicle_multiplier = max(0.8, min(1.6, vehicle_multiplier))
    final_premium = premium_after_ncb * effective_vehicle_multiplier

    return {
        "premium": round(final_premium, 2),
        "ncbDiscountPercentage": ncb_discount_percentage
    }
