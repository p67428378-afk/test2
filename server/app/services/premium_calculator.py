from fastapi import HTTPException

class PremiumCalculatorService:
    BASE_RATE = 500.0

    def calculate_premium(self, vehicle_value: float, ncb_percentage: float, vehicle_multiplier: float) -> float:
        if not (0.8 <= vehicle_multiplier <= 1.6):
            raise HTTPException(status_code=400, detail="Vehicle multiplier must be between 0.8 and 1.6")

        if not (20 <= ncb_percentage <= 50):
            raise HTTPException(status_code=400, detail="NCB percentage must be between 20 and 50")

        discount = ncb_percentage / 100
        premium = self.BASE_RATE * vehicle_multiplier * (1 - discount)
        
        return round(premium, 2)
