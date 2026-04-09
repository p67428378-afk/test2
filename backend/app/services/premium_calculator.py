from backend.app.core.config import settings

class PremiumCalculator:
    def calculate(self, vehicle_multiplier: float, ncb_level: int) -> float:
        if not (0.8 <= vehicle_multiplier <= 1.6):
            raise ValueError("Vehicle multiplier must be between 0.8 and 1.6")

        ncb_discount = self.get_ncb_discount(ncb_level)

        premium = (settings.BASE_PREMIUM_RATE * vehicle_multiplier) * (1 - ncb_discount)
        return round(premium, 2)

    def get_ncb_discount(self, ncb_level: int) -> float:
        if ncb_level < 1:
            return 0.0
        elif ncb_level == 1:
            return 0.20
        elif ncb_level == 2:
            return 0.30
        elif ncb_level == 3:
            return 0.40
        elif ncb_level >= 4:
            return 0.50
        else:
            # This case should ideally not be reached with proper input validation
            # in the API layer, but as a safeguard:
            return 0.0
