from .schemas import PremiumRequest

def calculate_premium(request: PremiumRequest) -> float:
    """
    Calculates the vehicle insurance premium based on the request data.
    """
    # Apply NCB discount, capped at 50%
    ncb_discount = min(request.ncb, 0.5)
    
    # Calculate premium after NCB discount
    premium_after_ncb = request.base_rate * (1 - ncb_discount)
    
    # Apply vehicle multiplier
    final_premium = premium_after_ncb * request.vehicle_multiplier
    
    return final_premium
