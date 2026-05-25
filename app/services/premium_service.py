from typing import Dict
from app.schemas.policy import VehicleType

class PremiumService:
    NCB_DISCOUNTS = {
        0: 0.0,
        1: 0.0,
        2: 0.20,
        3: 0.20,
        4: 0.35,
        5: 0.35,
        6: 0.50, # Capped at 50%
    }

    VEHICLE_MULTIPLIERS = {
        VehicleType.ECONOMY.value: 0.8,
        VehicleType.STANDARD.value: 1.0,
        VehicleType.SPORT.value: 1.2,
        VehicleType.LUXURY.value: 1.6,
    }

    def calculate_premium(
        self,
        base_rate: float,
        no_claims_years: int,
        vehicle_type: str
    ) -> Dict[str, float]:
        
        ncb_discount_percentage = self._get_ncb_discount(no_claims_years)
        vehicle_multiplier = self._get_vehicle_multiplier(vehicle_type)

        calculated_premium = base_rate * (1 - ncb_discount_percentage) * vehicle_multiplier

        return {
            "calculated_premium": round(calculated_premium, 2),
            "ncb_discount_percentage": ncb_discount_percentage,
            "vehicle_multiplier": vehicle_multiplier,
        }

    def _get_ncb_discount(self, no_claims_years: int) -> float:
        if no_claims_years >= 6:
            return self.NCB_DISCOUNTS[6]
        return self.NCB_DISCOUNTS.get(no_claims_years, 0.0)

    def _get_vehicle_multiplier(self, vehicle_type: str) -> float:
        return self.VEHICLE_MULTIPLIERS.get(vehicle_type, 1.0) # Default to 1.0 if type not found
