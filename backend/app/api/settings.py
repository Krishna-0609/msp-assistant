"""Settings/Configuration API endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, HttpUrl
from typing import Optional
import os
import logging
from app.core.security import get_current_user

router = APIRouter(prefix="/api/settings", tags=["settings"])
logger = logging.getLogger(__name__)

# In-memory storage (in production, use database)
_settings = {
    "teams_webhook_url": os.getenv("TEAMS_WEBHOOK_URL", ""),
    "slack_webhook_url": os.getenv("SLACK_WEBHOOK_URL", ""),
}


class WebhookConfigRequest(BaseModel):
    """Request model for webhook configuration."""

    webhook_type: str  # "teams" or "slack"
    webhook_url: str
    enabled: bool = True


class WebhookConfigResponse(BaseModel):
    """Response model for webhook configuration."""

    webhook_type: str
    webhook_url: str  # Masked for security
    enabled: bool
    configured: bool


class TestWebhookRequest(BaseModel):
    """Request model for testing webhook."""

    webhook_type: str  # "teams" or "slack"


class AllSettingsResponse(BaseModel):
    """Response model for all settings."""

    teams_webhook: Optional[WebhookConfigResponse] = None
    slack_webhook: Optional[WebhookConfigResponse] = None


def mask_webhook_url(url: str, show_chars: int = 20) -> str:
    """Mask webhook URL for security."""
    if not url or url == "PLACEHOLDER" or url == "":
        return ""
    if len(url) <= show_chars:
        return "***"
    return f"{url[:show_chars]}...***"


def validate_webhook_url(url: str) -> bool:
    """Validate webhook URL format."""
    if not url or url == "PLACEHOLDER" or url == "":
        return False
    return url.startswith("https://")


@router.get("/webhooks")
async def get_webhook_settings(current_user: str = Depends(get_current_user)):
    """Get all webhook configurations (masked)."""
    teams_url = _settings.get("teams_webhook_url", "")
    slack_url = _settings.get("slack_webhook_url", "")

    teams_configured = bool(teams_url) and teams_url != "PLACEHOLDER"
    slack_configured = bool(slack_url) and slack_url != "PLACEHOLDER"

    return AllSettingsResponse(
        teams_webhook=(
            WebhookConfigResponse(
                webhook_type="teams",
                webhook_url=mask_webhook_url(teams_url),
                enabled=teams_configured,
                configured=teams_configured,
            )
            if teams_configured
            else None
        ),
        slack_webhook=(
            WebhookConfigResponse(
                webhook_type="slack",
                webhook_url=mask_webhook_url(slack_url),
                enabled=slack_configured,
                configured=slack_configured,
            )
            if slack_configured
            else None
        ),
    )


@router.post("/webhooks/configure")
async def configure_webhook(
    request: WebhookConfigRequest,
    current_user: str = Depends(get_current_user),
):
    """Configure webhook URL."""
    # Validate webhook type
    if request.webhook_type.lower() not in ["teams", "slack"]:
        raise HTTPException(
            status_code=400, detail="webhook_type must be 'teams' or 'slack'"
        )

    # Validate URL
    if request.enabled and not validate_webhook_url(request.webhook_url):
        raise HTTPException(
            status_code=400, detail="Invalid webhook URL. Must start with https://"
        )

    # Store webhook URL
    key = f"{request.webhook_type.lower()}_webhook_url"
    if request.enabled:
        _settings[key] = request.webhook_url
        logger.info(f"Updated {request.webhook_type} webhook configuration")
    else:
        _settings[key] = ""
        logger.info(f"Disabled {request.webhook_type} webhook")

    return {
        "success": True,
        "webhook_type": request.webhook_type,
        "configured": request.enabled,
        "message": f"{request.webhook_type.capitalize()} webhook {'configured' if request.enabled else 'disabled'}",
    }


@router.get("/webhooks/{webhook_type}")
async def get_webhook_config(
    webhook_type: str,
    current_user: str = Depends(get_current_user),
):
    """Get specific webhook configuration."""
    if webhook_type.lower() not in ["teams", "slack"]:
        raise HTTPException(
            status_code=400, detail="webhook_type must be 'teams' or 'slack'"
        )

    key = f"{webhook_type.lower()}_webhook_url"
    url = _settings.get(key, "")
    configured = bool(url) and url != "PLACEHOLDER" and url != ""

    return WebhookConfigResponse(
        webhook_type=webhook_type,
        webhook_url=mask_webhook_url(url),
        enabled=configured,
        configured=configured,
    )


@router.post("/webhooks/test")
async def test_webhook_config(
    request: TestWebhookRequest,
    current_user: str = Depends(get_current_user),
):
    """Test webhook configuration."""
    if request.webhook_type.lower() not in ["teams", "slack"]:
        raise HTTPException(
            status_code=400, detail="webhook_type must be 'teams' or 'slack'"
        )

    key = f"{request.webhook_type.lower()}_webhook_url"
    webhook_url = _settings.get(key, "")

    if not webhook_url or webhook_url == "PLACEHOLDER" or webhook_url == "":
        return {
            "success": False,
            "message": f"{request.webhook_type} webhook not configured",
            "webhook_type": request.webhook_type,
        }

    # Send test message
    try:
        import httpx

        if request.webhook_type.lower() == "teams":
            payload = {
                "summary": "Test Message",
                "themeColor": "0078D4",
                "sections": [
                    {
                        "activityTitle": "MSP Assistant Test",
                        "text": "This is a test notification from MSP Assistant",
                        "facts": [
                            {"name": "Status", "value": "✅ Working"},
                            {"name": "Timestamp", "value": "Now"},
                        ],
                    }
                ],
            }
        else:  # Slack
            payload = {
                "text": "MSP Assistant Test",
                "blocks": [
                    {
                        "type": "header",
                        "text": {
                            "type": "plain_text",
                            "text": "MSP Assistant Test Notification",
                        },
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "✅ *Test Successful*\nWebhook is working correctly!",
                        },
                    },
                ],
            }

        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(webhook_url, json=payload)

            if response.status_code in [200, 204]:
                logger.info(f"Test {request.webhook_type} webhook successful")
                return {
                    "success": True,
                    "message": f"Test message sent successfully to {request.webhook_type}",
                    "webhook_type": request.webhook_type,
                    "status_code": response.status_code,
                }
            else:
                logger.error(f"Test webhook failed: {response.status_code}")
                return {
                    "success": False,
                    "message": f"Failed to send test message: {response.status_code}",
                    "webhook_type": request.webhook_type,
                }

    except Exception as e:
        logger.error(f"Exception testing webhook: {str(e)}")
        return {
            "success": False,
            "message": f"Error testing webhook: {str(e)}",
            "webhook_type": request.webhook_type,
        }


@router.get("/webhooks/docs")
async def get_webhook_docs():
    """Get webhook setup documentation."""
    return {
        "title": "Webhook Integration Setup",
        "description": "Configure Teams or Slack webhooks for notifications",
        "webhook_types": {
            "teams": {
                "name": "Microsoft Teams",
                "description": "Send notifications to Microsoft Teams channel",
                "setup_url": "https://docs.microsoft.com/en-us/outlook/actionable-messages/send-via-connectors",
                "setup_steps": [
                    "Open your Teams channel",
                    "Click '...' (More options) → Connectors",
                    "Search for 'Incoming Webhook'",
                    "Click 'Configure'",
                    "Give it a name (e.g., 'MSP Assistant')",
                    "Optionally upload an image",
                    "Click 'Create'",
                    "Copy the webhook URL",
                    "Paste it here",
                ],
            },
            "slack": {
                "name": "Slack",
                "description": "Send notifications to Slack channel",
                "setup_url": "https://api.slack.com/messaging/webhooks",
                "setup_steps": [
                    "Go to https://api.slack.com/apps",
                    "Click 'Create New App'",
                    "Choose 'From scratch'",
                    "Name: 'MSP Assistant', Workspace: Your workspace",
                    "Click 'Incoming Webhooks' in left menu",
                    "Toggle 'Activate Incoming Webhooks'",
                    "Click 'Add New Webhook to Workspace'",
                    "Select channel and authorize",
                    "Copy the webhook URL",
                    "Paste it here",
                ],
            },
        },
        "features": {
            "auto_alerts": "Automatically send alerts as notifications",
            "test_message": "Test webhook before using",
            "multiple_webhooks": "Configure both Teams and Slack",
            "masked_urls": "URLs are masked for security",
            "no_secrets_needed": "Configure directly in app, no GitHub secrets needed",
        },
    }
