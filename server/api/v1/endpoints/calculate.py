from fastapi import APIRouter, HTTPException, Query
from server.schemas import CalculateRequest, CalculateResponse, OperatorEnum

router = APIRouter()

@router.post("/calculate", response_model=CalculateResponse)
def calculate_post(request: CalculateRequest):
    operand1 = request.operand1
    operand2 = request.operand2
    operator = request.operator

    if operator == OperatorEnum.ADD:
        result = operand1 + operand2
    elif operator == OperatorEnum.SUBTRACT:
        result = operand1 - operand2
    elif operator == OperatorEnum.MULTIPLY:
        result = operand1 * operand2
    elif operator == OperatorEnum.DIVIDE:
        if operand2 == 0:
            raise HTTPException(status_code=400, detail="Division by zero is not allowed")
        result = operand1 / operand2
    else:
        raise HTTPException(status_code=400, detail="Invalid operator is provided")

    return CalculateResponse(result=result)

@router.get("/calculate", response_model=CalculateResponse)
def calculate_get(
    operand1: float = Query(..., description="The first operand"),
    operand2: float = Query(..., description="The second operand"),
    operator: str = Query(..., description="The arithmetic operator (+, -, *, /)")
):
    try:
        op = OperatorEnum(operator)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid operator is provided")

    if op == OperatorEnum.ADD:
        result = operand1 + operand2
    elif op == OperatorEnum.SUBTRACT:
        result = operand1 - operand2
    elif op == OperatorEnum.MULTIPLY:
        result = operand1 * operand2
    elif op == OperatorEnum.DIVIDE:
        if operand2 == 0:
            raise HTTPException(status_code=400, detail="Division by zero is not allowed")
        result = operand1 / operand2
    else:
        raise HTTPException(status_code=400, detail="Invalid operator is provided")

    return CalculateResponse(result=result)
