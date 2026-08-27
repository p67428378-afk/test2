from decimal import Decimal, ROUND_HALF_UP
from server.schemas.calculator import TipCalculationRequest, TipCalculationResponse


def calculate_tip(request: TipCalculationRequest) -> TipCalculationResponse:
    """
    Calculate tip amounts and per-person breakdown with exact 2 decimal place rounding.
    """
    bill = Decimal(str(request.bill_amount))
    tip_pct = Decimal(str(request.tip_percentage))
    people = Decimal(str(request.num_people))

    total_tip_dec = (bill * tip_pct / Decimal("100")).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )
    total_bill_dec = (bill + total_tip_dec).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )
    tip_per_person_dec = (total_tip_dec / people).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )
    total_per_person_dec = (total_bill_dec / people).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )

    return TipCalculationResponse(
        total_tip=float(total_tip_dec),
        total_bill=float(total_bill_dec),
        tip_per_person=float(tip_per_person_dec),
        total_per_person=float(total_per_person_dec),
    )
