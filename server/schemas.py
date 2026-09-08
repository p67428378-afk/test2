from pydantic import BaseModel, Field


class CalculationRequest(BaseModel):
    expression: str = Field(
        ..., description="Mathematical expression to evaluate", examples=["12 + 8"]
    )


class CalculationResponse(BaseModel):
    result: float = Field(..., description="Computed result")
    expression: str = Field(..., description="Original expression")
    status: str = Field(default="success", description="Execution status")
    timestamp: str = Field(..., description="ISO 8601 timestamp")


class ErrorResponse(BaseModel):
    detail: str = Field(..., description="Error details")
    error_code: str = Field(..., description="Standardized error code")


class HealthResponse(BaseModel):
    status: str = Field(default="healthy", description="System health status")
