"""
Module: server/services/fx_service.py
Purpose: Real-time FX rate fetching and hedging strategy management
"""


class FXService:
    @staticmethod
    def get_rate(source_currency: str, target_currency: str, strategy: str) -> float:
        """
        Fetch real-time FX rate based on currency pair and hedging strategy.
        """
        pair = (source_currency.upper(), target_currency.upper())

        # Mock rates
        rates = {
            ("CAD", "USD"): {"spot": 0.74, "forward": 0.75},
            ("MXN", "USD"): {"spot": 0.058, "forward": 0.059},
            ("EUR", "USD"): {"spot": 1.09, "forward": 1.10},
            ("GBP", "USD"): {"spot": 1.27, "forward": 1.28},
        }

        strategy_key = "forward" if "forward" in strategy.lower() else "spot"

        if pair in rates:
            return rates[pair][strategy_key]
        elif (target_currency.upper(), source_currency.upper()) in rates:
            # Inverse rate
            inv_pair = (target_currency.upper(), source_currency.upper())
            return round(1.0 / rates[inv_pair][strategy_key], 4)

        return 1.0

    @staticmethod
    def get_rate_lock_duration() -> int:
        """
        Returns the rate lock duration in seconds.
        """
        return 120
