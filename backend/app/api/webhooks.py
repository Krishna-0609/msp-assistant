from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from app.core.config import settings
from app.services.monitoring import monitoring_service
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/webhooks/test")
async def test_webhook() -> Dict[str, Any]:
    """Test current webhook configuration"""
    results = {
        "teams": {"configured": False, "status": "not configured"},
        "slack": {"configured": False, "status": "not configured"},
    }

    # Test Teams webhook
    if (
        settings.TEAMS_WEBHOOK_URL
        and "your-teams-webhook-url" not in settings.TEAMS_WEBHOOK_URL
    ):
        test_alert = {
            "type": "test_alert",
            "severity": "medium",
            "message": "This is a test alert from MSP Assistant",
            "service": "Webhook Test",
            "metadata": {"test": True},
        }
        success = await monitoring_service.send_teams_notification(test_alert)
        results["teams"]["configured"] = True
        results["teams"]["status"] = "success" if success else "failed"
    else:
        results["teams"]["status"] = "webhook URL not configured"

    # Test Slack webhook (if configured)
    if (
        settings.SLACK_WEBHOOK_URL
        and "your-slack-webhook-url" not in settings.SLACK_WEBHOOK_URL
    ):
        test_alert = {
            "type": "test_alert",
            "severity": "medium",
            "message": "This is a test alert from MSP Assistant",
            "service": "Webhook Test",
            "metadata": {"test": True},
        }
        success = await monitoring_service.send_slack_notification(test_alert)
        results["slack"]["configured"] = True
        results["slack"]["status"] = "success" if success else "failed"
    else:
        results["slack"]["status"] = "webhook URL not configured (optional)"

    return results


@router.get("/webhooks/config")
async def get_webhook_config() -> Dict[str, Any]:
    """Get current webhook configuration (sanitized)"""
    return {
        "teams": {
            "configured": bool(
                settings.TEAMS_WEBHOOK_URL
                and "your-teams-webhook-url" not in settings.TEAMS_WEBHOOK_URL
            ),
            "url": (
                settings.TEAMS_WEBHOOK_URL[:50] + "..."
                if settings.TEAMS_WEBHOOK_URL
                else None
            ),
        },
        "slack": {
            "configured": bool(
                settings.SLACK_WEBHOOK_URL
                and "your-slack-webhook-url" not in settings.SLACK_WEBHOOK_URL
            ),
            "url": (
                settings.SLACK_WEBHOOK_URL[:50] + "..."
                if settings.SLACK_WEBHOOK_URL
                else None
            ),
        },
    }


@router.get("/webhooks/docs")
async def get_webhook_docs() -> Dict[str, Any]:
    """Get documentation for webhook setup"""
    return {
        "teams": {
            "setup_url": "https://support.microsoft.com/en-us/office/incoming-webhooks-d53c5d92-1c4c-4f14-b1b1-9f1d3f6c3d9a",
            "status": (
                "configured"
                if settings.TEAMS_WEBHOOK_URL
                and "your-teams-webhook-url" not in settings.TEAMS_WEBHOOK_URL
                else "not configured"
            ),
            "instructions": [
                "Go to your Teams channel",
                "Click '...' (More options) next to channel name",
                "Select 'Connectors'",
                "Search for 'Incoming Webhook' and configure",
                "Copy the webhook URL to TEAMS_WEBHOOK_URL in .env",
            ],
        },
        "slack": {
            "setup_url": "https://api.slack.com/messaging/webhooks",
            "status": (
                "configured"
                if settings.SLACK_WEBHOOK_URL
                and "your-slack-webhook-url" not in settings.SLACK_WEBHOOK_URL
                else "not configured"
            ),
            "instructions": [
                "Go to https://api.slack.com/apps",
                "Create New App or select existing",
                "Enable 'Incoming Webhooks'",
                "Click 'Add New Webhook to Workspace'",
                "Select channel and authorize",
                "Copy Webhook URL to SLACK_WEBHOOK_URL in .env",
            ],
        },
    }
