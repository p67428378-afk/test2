
import pytest
from server.app.services.premium_calculator import PremiumCalculator

@pytest.fixture
def calculator():
    return PremiumCalculator()

def test_calculate_premium(calculator):
    # Test case 1: Standard calculation
    assert calculator.calculate(500, 0.2, 1.2) == 480.0

    # Test case 2: NCB capped at 50%
    assert calculator.calculate(500, 0.6, 1.0) == 250.0

    # Test case 3: Vehicle multiplier less than 1
    assert calculator.calculate(500, 0.25, 0.8) == 300.0

    # Test case 4: Zero NCB
    assert calculator.calculate(500, 0.0, 1.5) == 750.0
