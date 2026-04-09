import pytest
from backend.app.services.premium_calculator import PremiumCalculator

@pytest.fixture
def calculator():
    return PremiumCalculator()

def test_calculate_premium_valid(calculator):
    premium = calculator.calculate(vehicle_multiplier=1.2, ncb_level=2)
    assert premium == 420.0

def test_calculate_premium_min_multiplier(calculator):
    premium = calculator.calculate(vehicle_multiplier=0.8, ncb_level=1)
    assert premium == 320.0

def test_calculate_premium_max_multiplier(calculator):
    premium = calculator.calculate(vehicle_multiplier=1.6, ncb_level=1)
    assert premium == 640.0

def test_calculate_premium_invalid_multiplier_low(calculator):
    with pytest.raises(ValueError):
        calculator.calculate(vehicle_multiplier=0.7, ncb_level=1)

def test_calculate_premium_invalid_multiplier_high(calculator):
    with pytest.raises(ValueError):
        calculator.calculate(vehicle_multiplier=1.7, ncb_level=1)

def test_get_ncb_discount_level_0(calculator):
    discount = calculator.get_ncb_discount(0)
    assert discount == 0.0

def test_get_ncb_discount_level_1(calculator):
    discount = calculator.get_ncb_discount(1)
    assert discount == 0.20

def test_get_ncb_discount_level_2(calculator):
    discount = calculator.get_ncb_discount(2)
    assert discount == 0.30

def test_get_ncb_discount_level_3(calculator):
    discount = calculator.get_ncb_discount(3)
    assert discount == 0.40

def test_get_ncb_discount_level_4(calculator):
    discount = calculator.get_ncb_discount(4)
    assert discount == 0.50

def test_get_ncb_discount_level_5_capped(calculator):
    discount = calculator.get_ncb_discount(5)
    assert discount == 0.50
