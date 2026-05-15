from fastapi import APIRouter, HTTPException, status, Query
from typing import List
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()


class Report(BaseModel):
    id: str
    name: str
    type: str
    period: str
    generated_at: str
    pages: int
    status: str


# Mock data
REPORTS = [
    {
        "id": "1",
        "name": "Monthly Cost Report",
        "type": "cost",
        "period": "May 2026",
        "generated_at": "2026-05-14",
        "pages": 12,
        "status": "ready",
    },
    {
        "id": "2",
        "name": "Security Findings",
        "type": "security",
        "period": "May 2026",
        "generated_at": "2026-05-13",
        "pages": 8,
        "status": "ready",
    },
    {
        "id": "3",
        "name": "Performance Analysis",
        "type": "performance",
        "period": "May 2026",
        "generated_at": "2026-05-10",
        "pages": 15,
        "status": "ready",
    },
]


@router.get("/", response_model=List[Report])
async def get_reports(report_type: str = Query(None), limit: int = Query(20, le=100)):
    """Get generated reports"""
    results = REPORTS

    if report_type:
        results = [r for r in results if r["type"] == report_type]

    return results[:limit]


@router.get("/{report_id}", response_model=Report)
async def get_report(report_id: str):
    """Get specific report"""
    report = next((r for r in REPORTS if r["id"] == report_id), None)

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Report not found"
        )

    return report


@router.post("/generate")
async def generate_report(report_type: str = Query(...)):
    """Generate a new report"""
    new_report = {
        "id": str(len(REPORTS) + 1),
        "name": f"{report_type.title()} Report",
        "type": report_type,
        "period": "May 2026",
        "generated_at": datetime.now().isoformat(),
        "pages": 10,
        "status": "ready",
    }

    REPORTS.append(new_report)
    return new_report


@router.get("/{report_id}/download")
async def download_report(report_id: str):
    """Download report as PDF"""
    report = next((r for r in REPORTS if r["id"] == report_id), None)

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Report not found"
        )

    return {
        "download_url": f"/reports/{report_id}.pdf",
        "filename": f"{report['name']}.pdf",
    }
