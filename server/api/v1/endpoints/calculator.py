from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Literal

router = APIRouter()

class CalculationRequest(BaseModel):
    operand1: float = Field(..., description="The first number")
    operand2: float = Field(..., description="The second number")
    operator: Literal["+", "-", "*", "/"] = Field(..., description="The arithmetic operator")

class CalculationResponse(BaseModel):
    operand1: float
    operand2: float
    operator: str
    result: Optional[float] = None
    error: Optional[str] = None

@router.post("/calculate", response_model=CalculationResponse)
def calculate(request: CalculationRequest):
    operand1 = request.operand1
    operand2 = request.operand2
    operator = request.operator

    if operator == "+":
        result = operand1 + operand2
    elif operator == "-":
        result = operand1 - operand2
    elif operator == "*":
        result = operand1 * operand2
    elif operator == "/":
        if operand2 == 0:
            raise HTTPException(status_code=400, detail="Division by zero")
        result = operand1 / operand2
    else:
        raise HTTPException(status_code=400, detail="Invalid operator")

    return CalculationResponse(
        operand1=operand1,
        operand2=operand2,
        operator=operator,
        result=result,
        error=None
    )
