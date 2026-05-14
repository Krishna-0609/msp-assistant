from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum

class AlertType(str, Enum):
    VULNERABILITY = "vulnerability"
    COST_SPIKE = "cost_spike"
    PERFORMANCE = "performance"
    COMPLIANCE = "compliance"

class SeverityLevel(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class AlertCreate(BaseModel):
    type: AlertType
    severity: SeverityLevel
    message: str
    service: Optional[str] = None
    account_id: str
    metadata: Optional[dict] = None

class AlertResponse(BaseModel):
    id: str
    type: AlertType
    severity: SeverityLevel
    message: str
    service: Optional[str]
    account_id: str
    timestamp: datetime
    read: bool = False
    metadata: Optional[dict]

    class Config:
        from_attributes = True

class AlertUpdate(BaseModel):
    read: bool = True

class AlertFilter(BaseModel):
    account_id: Optional[str] = None
    type: Optional[AlertType] = None
    severity: Optional[SeverityLevel] = None
    read: Optional[bool] = None
    limit: int = Field(50, le=500)
    offset: int = Field(0, ge=0)
