class PremiumCalculator:
    def calculate(self, base_rate: float, ncb_percentage: float, vehicle_multiplier: float) -> float:
        """
        Calculates the final premium based on the base rate, NCB percentage, and vehicle multiplier.
        """
        # Apply NCB discount, capped at 50%
        ncb_discount = min(ncb_percentage, 50.0) / 100.0
        premium_after_ncb = base_rate * (1 - ncb_discount)

        # Apply vehicle multiplier, capped between 0.8 and 1.6
        multiplier = max(0.8, min(vehicle_multiplier, 1.6))
        final_premium = premium_after_ncb * multiplier

        return final_premium
