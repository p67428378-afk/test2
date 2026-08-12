from decimal import Decimal, ROUND_HALF_UP
from typing import Optional, Tuple


def calculate_painting_price(
    base_price: Decimal,
    custom_width: Optional[Decimal] = None,
    custom_height: Optional[Decimal] = None,
    price_multiplier: Decimal = Decimal("1.0000"),
    flat_fee: Decimal = Decimal("0.0000"),
) -> Tuple[bool, Optional[str], Decimal, Decimal, Decimal]:
    """
    Calculates dynamic painting price based on dimensions and frame option.

    Validation rules:
    - Width and Height (if provided) must be between 12 and 120 inches inclusive.

    Pricing Formula:
    - Standard base area = 24 * 36 = 576 sq in.
    - Area = width * height
    - Dimension multiplier = max(1.0, Area / 576.0) if custom dimensions provided else 1.0
    - Price = (Base Price * Dimension Multiplier * Frame Price Multiplier) + Frame Flat Fee

    Returns:
    - (is_valid, validation_error, area_sq_inches, dimension_multiplier, calculated_price)
    """
    MIN_DIM = Decimal("12.00")
    MAX_DIM = Decimal("120.00")
    STANDARD_AREA = Decimal("576.00")  # 24" x 36"

    # Convert to Decimal if floats passed
    base_price = Decimal(str(base_price))
    price_multiplier = Decimal(str(price_multiplier))
    flat_fee = Decimal(str(flat_fee))

    area_sq_inches = Decimal("0.00")
    dimension_multiplier = Decimal("1.0000")

    if custom_width is not None or custom_height is not None:
        if custom_width is None or custom_height is None:
            return (
                False,
                "Both width and height must be provided for custom dimensions.",
                Decimal("0"),
                Decimal("1.0"),
                base_price,
            )

        custom_width = Decimal(str(custom_width))
        custom_height = Decimal(str(custom_height))

        if custom_width < MIN_DIM or custom_width > MAX_DIM:
            return (
                False,
                f"Width must be between {MIN_DIM} and {MAX_DIM} inches.",
                Decimal("0"),
                Decimal("1.0"),
                base_price,
            )

        if custom_height < MIN_DIM or custom_height > MAX_DIM:
            return (
                False,
                f"Height must be between {MIN_DIM} and {MAX_DIM} inches.",
                Decimal("0"),
                Decimal("1.0"),
                base_price,
            )

        area_sq_inches = (custom_width * custom_height).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )
        if area_sq_inches > 0:
            raw_multiplier = area_sq_inches / STANDARD_AREA
            # If area is smaller than standard, keep baseline multiplier at least 0.5 or proportional
            dimension_multiplier = max(Decimal("0.5000"), raw_multiplier).quantize(
                Decimal("0.0001"), rounding=ROUND_HALF_UP
            )

    raw_price = (base_price * dimension_multiplier * price_multiplier) + flat_fee
    final_price = raw_price.quantize(Decimal("0.0001"), rounding=ROUND_HALF_UP)

    return True, None, area_sq_inches, dimension_multiplier, final_price
