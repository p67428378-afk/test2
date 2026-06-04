
class PremiumCalculator:
    def calculate(self, base_rate: float, ncb_percentage: float, vehicle_multiplier: float) -> float:
        ncb_discount = min(ncb_percentage, 0.5)
        premium_after_ncb = base_rate * (1 - ncb_discount)
        final_premium = premium_after_ncb * vehicle_multiplier
        return final_premium
