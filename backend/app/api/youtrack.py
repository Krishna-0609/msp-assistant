"""YouTrack API endpoints for ticket management."""

from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, Dict, Any
from pydantic import BaseModel
from app.core.security import get_current_user
from app.services.youtrack_service import YouTrackService

router = APIRouter(prefix="/api/youtrack", tags=["youtrack"])
youtrack_service = None


def get_youtrack_service():
    global youtrack_service
    if youtrack_service is None:
        youtrack_service = YouTrackService()
    return youtrack_service


# Request/Response Models
class CreateIssueRequest(BaseModel):
    """Request model for creating an issue."""

    title: str
    description: str
    issue_type: str = "Bug"
    priority: str = "Normal"
    tags: Optional[list[str]] = None


class CreateAlertIssueRequest(BaseModel):
    """Request model for creating an alert-based issue."""

    alert_type: str
    severity: str
    service: str
    message: str
    account_id: str
    metadata: Optional[Dict[str, Any]] = None


class AddCommentRequest(BaseModel):
    """Request model for adding a comment."""

    comment: str


class UpdateIssueRequest(BaseModel):
    """Request model for updating an issue."""

    status: Optional[str] = None
    priority: Optional[str] = None
    assignee: Optional[str] = None
    description: Optional[str] = None


class SearchIssuesRequest(BaseModel):
    """Request model for searching issues."""

    query: str
    limit: int = 10


# Endpoints


@router.get("/config")
async def get_youtrack_config(current_user: str = Depends(get_current_user)):
    """Get YouTrack configuration status."""
    service = get_youtrack_service()
    is_configured = await service.is_configured()
    return {
        "configured": is_configured,
        "project": service.project if is_configured else None,
        "base_url": service.base_url if is_configured else None,
    }


@router.post("/test")
async def test_youtrack_connection(current_user: str = Depends(get_current_user)):
    """Test YouTrack connection."""
    service = get_youtrack_service()
    result = await service.test_connection()
    if result.get("status") == "error":
        raise HTTPException(status_code=400, detail=result)
    return result


@router.post("/issues")
async def create_issue(
    request: CreateIssueRequest,
    current_user: str = Depends(get_current_user),
):
    """Create a new YouTrack issue."""
    service = get_youtrack_service()
    result = await service.create_issue(
        title=request.title,
        description=request.description,
        issue_type=request.issue_type,
        priority=request.priority,
        tags=request.tags,
    )

    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result)

    return result


@router.post("/issues/from-alert")
async def create_issue_from_alert(
    request: CreateAlertIssueRequest,
    current_user: str = Depends(get_current_user),
):
    """Create a YouTrack issue from an alert."""
    service = get_youtrack_service()
    result = await service.create_alert_issue(
        alert_type=request.alert_type,
        severity=request.severity,
        service=request.service,
        message=request.message,
        account_id=request.account_id,
        metadata=request.metadata,
    )

    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result)

    return result


@router.get("/issues/{issue_id}")
async def get_issue(
    issue_id: str,
    current_user: str = Depends(get_current_user),
):
    """Get details of a specific issue."""
    service = get_youtrack_service()
    result = await service.get_issue(issue_id)

    if not result.get("success"):
        raise HTTPException(status_code=404, detail=result)

    return result


@router.put("/issues/{issue_id}")
async def update_issue(
    issue_id: str,
    request: UpdateIssueRequest,
    current_user: str = Depends(get_current_user),
):
    """Update an issue."""
    service = get_youtrack_service()
    updates = {}
    if request.status:
        updates["state"] = request.status
    if request.priority:
        updates["priority"] = request.priority
    if request.assignee:
        updates["assignee"] = request.assignee
    if request.description:
        updates["description"] = request.description

    if not updates:
        raise HTTPException(status_code=400, detail="No updates provided")

    result = await service.update_issue(issue_id, updates)

    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result)

    return result


@router.post("/issues/{issue_id}/comments")
async def add_comment(
    issue_id: str,
    request: AddCommentRequest,
    current_user: str = Depends(get_current_user),
):
    """Add a comment to an issue."""
    service = get_youtrack_service()
    result = await service.add_comment(issue_id, request.comment)

    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result)

    return result


@router.post("/search")
async def search_issues(
    request: SearchIssuesRequest,
    current_user: str = Depends(get_current_user),
):
    """Search for issues."""
    service = get_youtrack_service()
    result = await service.search_issues(request.query, request.limit)

    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result)

    return result


@router.get("/docs")
async def get_youtrack_docs():
    """Get YouTrack setup documentation."""
    return {
        "title": "YouTrack Integration Setup Guide",
        "description": "How to set up and configure YouTrack integration",
        "steps": [
            {
                "step": 1,
                "title": "Get YouTrack Instance",
                "description": "Ensure you have a YouTrack instance running (Cloud or Self-hosted)",
                "link": "https://www.jetbrains.com/youtrack/",
            },
            {
                "step": 2,
                "title": "Generate API Token",
                "description": "In YouTrack, go to Settings > API Tokens > Generate Token",
                "permissions": ["Read", "Write", "Create issues"],
            },
            {
                "step": 3,
                "title": "Add to .env",
                "description": "Update backend/.env with your YouTrack credentials",
                "example": """
YOUTRACK_URL=https://your-instance.youtrack.cloud
YOUTRACK_TOKEN=your-generated-api-token
YOUTRACK_PROJECT=MSP
YOUTRACK_ISSUE_LINK_BASE=https://your-instance.youtrack.cloud/issues
                """,
            },
            {
                "step": 4,
                "title": "Test Connection",
                "description": "POST /api/youtrack/test to verify setup",
                "curl": "curl -X POST http://localhost:8000/api/youtrack/test -H 'Authorization: Bearer YOUR_TOKEN'",
            },
            {
                "step": 5,
                "title": "Create Issues",
                "description": "Use /api/youtrack/issues or /api/youtrack/issues/from-alert endpoints",
                "features": [
                    "Automatic issue creation from alerts",
                    "Add tags and priorities",
                    "Link to services and accounts",
                    "Add comments and updates",
                ],
            },
        ],
        "features": {
            "auto_tickets": "Automatically create tickets when critical alerts occur",
            "alert_linking": "Link alerts to YouTrack issues",
            "team_integration": "Assign to team members via YouTrack",
            "tracking": "Track issue status in YouTrack dashboard",
            "search": "Search and filter issues by various criteria",
        },
    }
