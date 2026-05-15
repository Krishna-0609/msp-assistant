from fastapi import APIRouter, HTTPException, status, Query
from typing import List
from datetime import datetime
from app.schemas.alert import AlertResponse, AlertCreate, AlertUpdate, SeverityLevel
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Mock data
ALERTS_DATA = [
    {
        "id": "1",
        "type": "vulnerability",
        "severity": "critical",
        "message": "EC2 instance has open port 22 exposed to internet",
        "service": "EC2",
        "account_id": "123456789012",
        "timestamp": datetime.now(),
        "read": False,
        "metadata": {"instance_id": "i-1234567890abcdef0"},
    },
    {
        "id": "2",
        "type": "cost_spike",
        "severity": "high",
        "message": "Cost spike detected: EC2 costs increased by 15%",
        "service": "EC2",
        "account_id": "123456789012",
        "timestamp": datetime.now(),
        "read": False,
        "metadata": {"threshold": 15, "current": 12},
    },
    {
        "id": "3",
        "type": "performance",
        "severity": "medium",
        "message": "RDS database experiencing high latency",
        "service": "RDS",
        "account_id": "123456789012",
        "timestamp": datetime.now(),
        "read": True,
        "metadata": {"latency_ms": 250},
    },
]


@router.get("/", response_model=List[AlertResponse])
async def get_alerts(
    account_id: str = Query(None),
    severity: str = Query(None),
    read: bool = Query(None),
    limit: int = Query(50, le=500),
    offset: int = Query(0, ge=0),
):
    """Get alerts with optional filters"""
    results = ALERTS_DATA

    if account_id:
        results = [a for a in results if a["account_id"] == account_id]

    if severity:
        results = [a for a in results if a["severity"] == severity]

    if read is not None:
        results = [a for a in results if a["read"] == read]

    return results[offset : offset + limit]


@router.get("/{alert_id}", response_model=AlertResponse)
async def get_alert(alert_id: str):
    """Get specific alert"""
    alert = next((a for a in ALERTS_DATA if a["id"] == alert_id), None)

    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Alert not found"
        )

    return alert


@router.patch("/{alert_id}", response_model=AlertResponse)
async def update_alert(alert_id: str, update: AlertUpdate):
    """Mark alert as read/unread"""
    alert = next((a for a in ALERTS_DATA if a["id"] == alert_id), None)

    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Alert not found"
        )

    alert["read"] = update.read
    logger.info(f"Alert {alert_id} marked as {'read' if update.read else 'unread'}")

    return alert


@router.post("/", response_model=AlertResponse)
async def create_alert(alert: AlertCreate):
    """Create a new alert"""
    new_alert = {
        "id": str(len(ALERTS_DATA) + 1),
        **alert.model_dump(),
        "timestamp": datetime.now(),
        "read": False,
    }

    ALERTS_DATA.append(new_alert)
    logger.info(f"New alert created: {new_alert['id']}")

    return new_alert


@router.get("/severity/critical")
async def get_critical_alerts(account_id: str = Query(...)):
    """Get critical severity alerts for emergency response"""
    alerts = [
        a
        for a in ALERTS_DATA
        if a["severity"] == "critical"
        and a["account_id"] == account_id
        and not a["read"]
    ]
    return alerts
