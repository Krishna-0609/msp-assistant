from fastapi import APIRouter, HTTPException, status, Query
from datetime import datetime, timedelta
from typing import List, Dict, Any
from app.schemas.cost import CostResponse, CostSummary, CostFilterRequest
from app.services.aws_service import aws_service
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Mock data
COSTS_DATA = [
    {
        "id": "1",
        "service": "EC2",
        "amount": 2450.50,
        "currency": "USD",
        "date": datetime.now() - timedelta(days=1),
        "account_id": "123456789012",
        "region": "us-east-1",
        "trend": "up",
        "trend_percent": 12,
    },
    {
        "id": "2",
        "service": "S3",
        "amount": 580.25,
        "currency": "USD",
        "date": datetime.now() - timedelta(days=1),
        "account_id": "123456789012",
        "region": "us-east-1",
        "trend": "down",
        "trend_percent": 8,
    },
    {
        "id": "3",
        "service": "Lambda",
        "amount": 120.75,
        "currency": "USD",
        "date": datetime.now() - timedelta(days=1),
        "account_id": "123456789012",
        "region": "us-east-1",
        "trend": "neutral",
        "trend_percent": 0,
    },
    {
        "id": "4",
        "service": "RDS",
        "amount": 890.30,
        "currency": "USD",
        "date": datetime.now() - timedelta(days=1),
        "account_id": "123456789012",
        "region": "us-east-1",
        "trend": "up",
        "trend_percent": 5,
    },
]


@router.get("/", response_model=List[CostResponse])
async def get_costs(
    account_id: str = Query(None),
    service: str = Query(None),
    limit: int = Query(100, le=1000),
    offset: int = Query(0, ge=0),
):
    """Get AWS costs with optional filters"""
    results = COSTS_DATA

    if account_id:
        results = [c for c in results if c["account_id"] == account_id]

    if service:
        results = [c for c in results if c["service"] == service]

    return results[offset : offset + limit]


@router.get("/summary", response_model=CostSummary)
async def get_cost_summary(account_id: str = Query(None)):
    """Get cost summary for dashboard"""
    costs = COSTS_DATA

    if account_id:
        costs = [c for c in costs if c["account_id"] == account_id]

    total = sum(c["amount"] for c in costs)
    highest = max(costs, key=lambda x: x["amount"]) if costs else None

    return {
        "total_cost": total,
        "highest_cost_service": highest["service"] if highest else "N/A",
        "highest_cost_amount": highest["amount"] if highest else 0,
        "potential_savings": 520.00,
        "services_count": len(set(c["service"] for c in costs)),
        "period_start": datetime.now() - timedelta(days=30),
        "period_end": datetime.now(),
    }


@router.get("/{cost_id}", response_model=CostResponse)
async def get_cost(cost_id: str):
    """Get specific cost record"""
    cost = next((c for c in COSTS_DATA if c["id"] == cost_id), None)

    if not cost:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Cost not found"
        )

    return cost


@router.post("/analyze")
async def analyze_costs(account_id: str = Query(...)):
    """Analyze costs and get recommendations"""
    logger.info(f"Analyzing costs for account {account_id}")

    return {
        "recommendations": [
            {
                "title": "Reserved Instances",
                "savings": 400,
                "description": "Save 40% on EC2 with 1-year commits",
                "priority": "high",
            },
            {
                "title": "Idle Resources",
                "savings": 120,
                "description": "Terminate unused instances",
                "priority": "high",
            },
            {
                "title": "Storage Optimization",
                "savings": 150,
                "description": "Archive old S3 objects to Glacier",
                "priority": "medium",
            },
        ],
        "total_potential_savings": 670,
    }


@router.post("/anomalies")
async def detect_cost_anomalies(
    account_id: str = Query(...), threshold_percent: float = Query(30)
):
    """Detect cost anomalies for an account"""
    logger.info(
        f"Detecting anomalies for account {account_id} with threshold {threshold_percent}%"
    )

    try:
        anomalies = await aws_service.detect_cost_anomalies(
            account_id=account_id, threshold_percent=threshold_percent
        )
        return anomalies
    except Exception as e:
        logger.error(f"Error detecting anomalies: {str(e)}")
        return []


@router.get("/trend")
async def get_cost_trend(
    account_id: str = Query(...), days: int = Query(30, ge=1, le=365)
):
    """Get historical cost trend"""
    logger.info(f"Getting cost trend for account {account_id} for {days} days")

    trend_data = []
    for i in range(days, 0, -1):
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        # Simulate trend data - in production, this would query Cost Explorer
        base_amount = 4000 + (i % 10) * 100
        amount = base_amount + (i % 5) * 50
        trend_data.append({"date": date, "amount": amount})

    return trend_data
