from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal

from server.api.v1.endpoints import password_reset
from server.database import Base, engine

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MathFlow Calculator API", version="1.0.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include existing password reset router
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])

class CalculationRequest(BaseModel):
    operand1: float = Field(..., description="The first operand")
    operand2: float = Field(..., description="The second operand")
    operator: Literal["+", "-", "*", "/"] = Field(..., description="The arithmetic operator")

class CalculationResponse(BaseModel):
    result: float = Field(..., description="The result of the calculation")

@app.post("/api/v1/calculate", response_model=CalculationResponse, status_code=status.HTTP_200_OK)
def calculate(request: CalculationRequest):
    op1 = request.operand1
    op2 = request.operand2
    operator = request.operator

    if operator == "+":
        result = op1 + op2
    elif operator == "-":
        result = op1 - op2
    elif operator == "*":
        result = op1 * op2
    elif operator == "/":
        if op2 == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Division by zero is not allowed."
            )
        result = op1 / op2
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid operator: {operator}"
        )

    return CalculationResponse(result=result)

@app.get("/")
def read_root():
    return {"message": "Welcome to the MathFlow Calculator API"}
