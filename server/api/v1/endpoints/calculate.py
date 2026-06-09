from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server import crud, schemas
from server.database import get_db

router = APIRouter()

def format_number(val: float) -> str:
    if val.is_integer():
        return str(int(val))
    return str(val)

@router.post("/calculate", response_model=schemas.CalculationResponse, status_code=status.HTTP_200_OK)
def calculate(payload: schemas.CalculationCreate, db: Session = Depends(get_db)):
    operand1 = payload.operand1
    operand2 = payload.operand2
    operator = payload.operator

    # Map operator to symbol for formula
    operator_symbols = {
        "add": "+",
        "subtract": "-",
        "multiply": "*",
        "divide": "/"
    }
    symbol = operator_symbols.get(operator, "?")
    formula = f"{format_number(operand1)} {symbol} {format_number(operand2)}"

    if operator == "divide" and operand2 == 0:
        # Save failed calculation to DB
        crud.create_calculation(
            db=db,
            operand1=operand1,
            operand2=operand2,
            operator=operator,
            result=None,
            formula=formula,
            status="error"
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot divide by zero"
        )

    # Perform calculation
    if operator == "add":
        result = operand1 + operand2
    elif operator == "subtract":
        result = operand1 - operand2
    elif operator == "multiply":
        result = operand1 * operand2
    elif operator == "divide":
        result = operand1 / operand2
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid operator"
        )

    # Save successful calculation to DB
    db_calc = crud.create_calculation(
        db=db,
        operand1=operand1,
        operand2=operand2,
        operator=operator,
        result=result,
        formula=formula,
        status="success"
    )
    return db_calc

@router.get("/calculations", response_model=List[schemas.CalculationResponse])
def get_calculations(db: Session = Depends(get_db)):
    return crud.get_calculations(db=db)

@router.delete("/calculations")
def clear_calculations(db: Session = Depends(get_db)):
    return crud.clear_calculations(db=db)
