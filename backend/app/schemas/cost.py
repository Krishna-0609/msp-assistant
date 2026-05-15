from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class CostItem(BaseModel):
    service: str
    amount: float = Field(..., gt=0)
    currency: str = "USD"
    date: datetime
    account_id: str
    region: Optional[str] = None


class CostResponse(BaseModel):
    id: str
    service: str
    amount: float
    currency: str
    date: datetime
    account_id: str
    region: Optional[str]
    trend: str
    trend_percent: float

    class Config:
        from_attributes = True


class CostSummary(BaseModel):
    total_cost: float
    highest_cost_service: str
    highest_cost_amount: float
    potential_savings: float
    services_count: int
    period_start: datetime
    period_end: datetime


class CostFilterRequest(BaseModel):
    account_id: Optional[str] = None
    service: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    region: Optional[str] = None
    limit: int = Field(100, le=1000)
    offset: int = Field(0, ge=0)
