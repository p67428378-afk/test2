from server.schemas.calculator import TipCalculationRequest, TipCalculationResponse


def calculate_tip(request: TipCalculationRequest) -> TipCalculationResponse:
    """
    Calculate total tip, total bill, and per-person split amounts.

    Formulas:
    - total_tip = round(bill_amount * (tip_percentage / 100.0), 2)
    - total_bill = round(bill_amount + total_tip, 2)
    - tip_per_person = round(total_tip / num_people, 2)
    - total_per_person = round(total_bill / num_people, 2)
    """
    bill_amount = request.bill_amount
    tip_percentage = request.tip_percentage
    num_people = request.num_people

    total_tip = round(bill_amount * (tip_percentage / 100.0), 2)
    total_bill = round(bill_amount + total_tip, 2)
    tip_per_person = round(total_tip / num_people, 2)
    total_per_person = round(total_bill / num_people, 2)

    return TipCalculationResponse(
        total_tip=total_tip,
        total_bill=total_bill,
        tip_per_person=tip_per_person,
        total_per_person=total_per_person,
    )
