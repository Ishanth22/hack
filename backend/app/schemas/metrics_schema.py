from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime


class MetricsCreate(BaseModel):
    startup_id: str
    month: str  # Format: YYYY-MM
    monthly_users: int
    monthly_revenue: float
    employee_count: int
    funding_raised: float
    burn_rate: float

    @field_validator("month")
    @classmethod
    def valid_month(cls, v):
        import re
        if not re.match(r"^\d{4}-\d{2}$", v):
            raise ValueError("Month must be in YYYY-MM format")
        return v

    @field_validator("monthly_users", "employee_count")
    @classmethod
    def non_negative_int(cls, v):
        if v < 0:
            raise ValueError("Value must be non-negative")
        return v

    @field_validator("monthly_revenue", "funding_raised", "burn_rate")
    @classmethod
    def non_negative_float(cls, v):
        if v < 0:
            raise ValueError("Value must be non-negative")
        return v


class MetricsResponse(BaseModel):
    id: str
    startup_id: str
    month: str
    monthly_users: int
    monthly_revenue: float
    employee_count: int
    funding_raised: float
    burn_rate: float
    created_at: Optional[datetime] = None
