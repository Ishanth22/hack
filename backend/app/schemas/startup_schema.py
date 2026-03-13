from pydantic import BaseModel, HttpUrl, field_validator
from typing import Optional
from datetime import datetime
import re


class StartupCreate(BaseModel):
    name: str
    sector: str
    founding_year: int
    stage: str
    website: Optional[str] = None
    location: str

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v):
        v = v.strip()
        if not v:
            raise ValueError("Name cannot be empty")
        return v

    @field_validator("founding_year")
    @classmethod
    def valid_year(cls, v):
        if v < 1900 or v > datetime.now().year:
            raise ValueError("Invalid founding year")
        return v

    @field_validator("stage")
    @classmethod
    def valid_stage(cls, v):
        valid = ["Pre-seed", "Seed", "Series A", "Series B", "Series C", "Series D+", "IPO"]
        if v not in valid:
            raise ValueError(f"Stage must be one of {valid}")
        return v


class StartupResponse(BaseModel):
    id: str
    name: str
    sector: str
    founding_year: int
    stage: str
    website: Optional[str] = None
    location: str
    created_at: Optional[datetime] = None
