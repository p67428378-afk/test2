from pydantic import BaseModel, Field, model_validator


class PasswordGenerateRequest(BaseModel):
    length: int = Field(
        default=16,
        ge=8,
        le=128,
        description="Length of the password (8 to 128 characters)",
    )
    include_uppercase: bool = Field(
        default=True, description="Include uppercase letters (A-Z)"
    )
    include_lowercase: bool = Field(
        default=True, description="Include lowercase letters (a-z)"
    )
    include_digits: bool = Field(default=True, description="Include numbers (0-9)")
    include_symbols: bool = Field(default=True, description="Include special symbols")

    @model_validator(mode="after")
    def validate_at_least_one_character_set(self):
        if not (
            self.include_uppercase
            or self.include_lowercase
            or self.include_digits
            or self.include_symbols
        ):
            raise ValueError(
                "At least one character set (uppercase, lowercase, digits, or symbols) must be selected."
            )
        return self


class PasswordGenerateResponse(BaseModel):
    password: str
    length: int
    entropy_bits: float
    strength: str
    generated_at: str


class HealthCheckResponse(BaseModel):
    status: str
    service: str
    timestamp: str


class ErrorDetail(BaseModel):
    detail: str
