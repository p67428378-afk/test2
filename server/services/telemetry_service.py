from typing import Tuple, Optional


def evaluate_telemetry_thresholds(
    temperature_celsius: float, humidity_percent: float
) -> Tuple[bool, Optional[str]]:
    """
    Evaluates temperature and humidity against physiological hive thresholds.
    Optimal brood temperature is 32.0°C to 36.0°C.
    Optimal relative humidity is 50.0% to 75.0%.
    """
    alerts = []

    if temperature_celsius < 32.0:
        alerts.append(
            f"Low temperature ({temperature_celsius:.1f}°C < 32.0°C): Risk of brood chilling."
        )
    elif temperature_celsius > 36.0:
        alerts.append(
            f"High temperature ({temperature_celsius:.1f}°C > 36.0°C): Risk of heat stress."
        )

    if humidity_percent < 50.0:
        alerts.append(f"Low humidity ({humidity_percent:.1f}% < 50.0%).")
    elif humidity_percent > 75.0:
        alerts.append(
            f"High humidity ({humidity_percent:.1f}% > 75.0%): Risk of fungal growth."
        )

    if alerts:
        return True, " | ".join(alerts)

    return False, None
