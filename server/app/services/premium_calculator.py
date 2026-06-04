
class PremiumCalculator:
    BASE_RATE = 500.0

    @staticmethod
    def calculate(ncb_percentage: float, vehicle_multiplier: float) -> float:
        """
        Calculates the insurance premium based on NCB percentage and vehicle multiplier.

        Args:
            ncb_percentage: No-Claim Bonus percentage (between 0.20 and 0.50).
            vehicle_multiplier: Vehicle risk multiplier (between 0.8 and 1.6).

        Returns:
            The calculated premium.
        """
        # Clamp values to their allowed ranges
        ncb_percentage = max(0.20, min(0.50, ncb_percentage))
        vehicle_multiplier = max(0.8, min(1.6, vehicle_multiplier))

        premium = (PremiumCalculator.BASE_RATE * vehicle_multiplier) * (1 - ncb_percentage)
        return round(premium, 2)

