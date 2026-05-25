from app.schemas.policy import PremiumCalculationRequest

def get_ncb_discount(claim_free_years: int) -> float:
    if claim_free_years >= 5:
        return 0.50
    elif claim_free_years == 4:
        return 0.45
    elif claim_free_years == 3:
        return 0.35
    elif claim_free_years == 2:
        return 0.25
    elif claim_free_years == 1:
        return 0.20
    else:
        return 0.0

def calculate_premium(request: PremiumCalculationRequest) -> float:
    if not (0.8 <= request.vehicleMultiplier <= 1.6):
        raise ValueError("Vehicle multiplier must be between 0.8 and 1.6")
    if request.claimFreeYears < 0:
        raise ValueError("Claim free years cannot be negative")

    ncb_discount = get_ncb_discount(request.claimFreeYears)
    discounted_premium = request.baseRate - (request.baseRate * ncb_discount)
    final_premium = discounted_premium * request.vehicleMultiplier
    return final_premium
