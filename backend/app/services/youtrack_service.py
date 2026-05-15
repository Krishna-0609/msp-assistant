"""YouTrack Integration Service for creating and managing tickets."""

import httpx
import logging
from typing import Optional, Dict, Any
from datetime import datetime
from app.core.config import settings

logger = logging.getLogger(__name__)


class YouTrackService:
    """Service for interacting with YouTrack API."""

    def __init__(self):
        """Initialize YouTrack service with configuration."""
        self.base_url = settings.YOUTRACK_URL.rstrip("/")
        self.token = settings.YOUTRACK_TOKEN
        self.project = settings.YOUTRACK_PROJECT
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    async def is_configured(self) -> bool:
        """Check if YouTrack is properly configured."""
        if not self.token or self.token == "your-youtrack-api-token":
            return False
        if not self.base_url or self.base_url == "https://your-youtrack-instance.com":
            return False
        return True

    async def test_connection(self) -> Dict[str, Any]:
        """Test YouTrack connection with API call."""
        try:
            if not await self.is_configured():
                return {
                    "configured": False,
                    "status": "YouTrack not configured",
                    "message": "Please set YOUTRACK_URL and YOUTRACK_TOKEN in .env",
                }

            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(
                    f"{self.base_url}/api/users/me",
                    headers=self.headers,
                )

                if response.status_code == 200:
                    user_data = response.json()
                    return {
                        "configured": True,
                        "status": "success",
                        "message": f"Connected to YouTrack as {user_data.get('login', 'Unknown')}",
                        "user": user_data,
                    }
                else:
                    return {
                        "configured": True,
                        "status": "error",
                        "message": f"Authentication failed: {response.status_code}",
                    }
        except Exception as e:
            logger.error(f"YouTrack connection test failed: {str(e)}")
            return {
                "configured": True,
                "status": "error",
                "message": f"Connection failed: {str(e)}",
            }

    async def create_issue(
        self,
        title: str,
        description: str,
        issue_type: str = "Bug",
        priority: str = "Normal",
        tags: Optional[list[str]] = None,
        custom_fields: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Create a new issue in YouTrack.

        Args:
            title: Issue title
            description: Issue description
            issue_type: Type of issue (Bug, Feature, Task, etc.)
            priority: Priority level (Critical, High, Normal, Low)
            tags: List of tags to add to the issue
            custom_fields: Additional custom fields

        Returns:
            Created issue details or error information
        """
        if not await self.is_configured():
            return {
                "success": False,
                "error": "YouTrack not configured",
                "issue": None,
            }

        try:
            # Prepare the issue payload
            payload = {
                "summary": title,
                "description": description,
                "project": {"key": self.project},
                "type": issue_type,
                "priority": priority,
                "tags": [{"name": tag} for tag in (tags or [])],
            }

            # Add custom fields if provided
            if custom_fields:
                payload["customFields"] = custom_fields

            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(
                    f"{self.base_url}/api/issues",
                    json=payload,
                    headers=self.headers,
                )

                if response.status_code in [200, 201]:
                    issue_data = response.json()
                    issue_id = issue_data.get("id")
                    logger.info(f"Created YouTrack issue: {issue_id}")
                    return {
                        "success": True,
                        "issue": issue_data,
                        "issue_id": issue_id,
                        "url": f"{self.base_url}/issues/{issue_id}",
                    }
                else:
                    error_msg = response.text
                    logger.error(
                        f"Failed to create issue: {response.status_code} - {error_msg}"
                    )
                    return {
                        "success": False,
                        "error": f"Failed to create issue: {response.status_code}",
                        "issue": None,
                    }
        except Exception as e:
            logger.error(f"Exception creating YouTrack issue: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "issue": None,
            }

    async def create_alert_issue(
        self,
        alert_type: str,
        severity: str,
        service: str,
        message: str,
        account_id: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Create a YouTrack issue from an alert.

        Args:
            alert_type: Type of alert (cost_spike, vulnerability, performance)
            severity: Severity level (CRITICAL, HIGH, MEDIUM, LOW)
            service: AWS service affected
            message: Alert message
            account_id: AWS account ID
            metadata: Additional metadata

        Returns:
            Created issue information
        """
        # Map severity to priority
        severity_to_priority = {
            "CRITICAL": "Critical",
            "HIGH": "High",
            "MEDIUM": "Normal",
            "LOW": "Low",
        }

        priority = severity_to_priority.get(severity, "Normal")

        # Create title
        title = f"[{alert_type.upper()}] {severity} - {service} - {message[:50]}"

        # Create detailed description
        description = f"""
**Alert Type:** {alert_type}
**Severity:** {severity}
**Service:** {service}
**Account ID:** {account_id}
**Time:** {datetime.utcnow().isoformat()}

**Message:**
{message}

**Metadata:**
{self._format_metadata(metadata)}

**Action Required:** Review alert details and take appropriate action.
"""

        # Create tags
        tags = [alert_type, severity.lower(), service, account_id]

        return await self.create_issue(
            title=title,
            description=description,
            issue_type="Bug" if severity in ["CRITICAL", "HIGH"] else "Task",
            priority=priority,
            tags=tags,
            custom_fields={
                "alert_type": alert_type,
                "service": service,
                "account": account_id,
            },
        )

    async def get_issue(self, issue_id: str) -> Dict[str, Any]:
        """Get details of a specific issue."""
        if not await self.is_configured():
            return {"success": False, "error": "YouTrack not configured", "issue": None}

        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(
                    f"{self.base_url}/api/issues/{issue_id}",
                    headers=self.headers,
                )

                if response.status_code == 200:
                    return {
                        "success": True,
                        "issue": response.json(),
                    }
                else:
                    return {
                        "success": False,
                        "error": f"Issue not found: {response.status_code}",
                        "issue": None,
                    }
        except Exception as e:
            logger.error(f"Exception getting YouTrack issue: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "issue": None,
            }

    async def update_issue(
        self, issue_id: str, updates: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update an existing issue."""
        if not await self.is_configured():
            return {"success": False, "error": "YouTrack not configured"}

        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.put(
                    f"{self.base_url}/api/issues/{issue_id}",
                    json=updates,
                    headers=self.headers,
                )

                if response.status_code in [200, 204]:
                    logger.info(f"Updated YouTrack issue: {issue_id}")
                    return {"success": True, "issue_id": issue_id}
                else:
                    return {
                        "success": False,
                        "error": f"Failed to update issue: {response.status_code}",
                    }
        except Exception as e:
            logger.error(f"Exception updating YouTrack issue: {str(e)}")
            return {"success": False, "error": str(e)}

    async def add_comment(self, issue_id: str, comment: str) -> Dict[str, Any]:
        """Add a comment to an issue."""
        if not await self.is_configured():
            return {"success": False, "error": "YouTrack not configured"}

        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(
                    f"{self.base_url}/api/issues/{issue_id}/comments",
                    json={"text": comment},
                    headers=self.headers,
                )

                if response.status_code in [200, 201]:
                    logger.info(f"Added comment to YouTrack issue: {issue_id}")
                    return {"success": True, "issue_id": issue_id}
                else:
                    return {
                        "success": False,
                        "error": f"Failed to add comment: {response.status_code}",
                    }
        except Exception as e:
            logger.error(f"Exception adding comment to YouTrack issue: {str(e)}")
            return {"success": False, "error": str(e)}

    async def search_issues(self, query: str, limit: int = 10) -> Dict[str, Any]:
        """Search for issues in YouTrack."""
        if not await self.is_configured():
            return {"success": False, "error": "YouTrack not configured", "issues": []}

        try:
            async with httpx.AsyncClient(timeout=30) as client:
                params = {
                    "query": query,
                    "fields": "id,summary,created,updated,state",
                    "$top": limit,
                }
                response = await client.get(
                    f"{self.base_url}/api/issues",
                    params=params,
                    headers=self.headers,
                )

                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True,
                        "issues": data.get("issues", []),
                        "count": len(data.get("issues", [])),
                    }
                else:
                    return {
                        "success": False,
                        "error": f"Search failed: {response.status_code}",
                        "issues": [],
                    }
        except Exception as e:
            logger.error(f"Exception searching YouTrack issues: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "issues": [],
            }

    @staticmethod
    def _format_metadata(metadata: Optional[Dict[str, Any]]) -> str:
        """Format metadata for display in issue description."""
        if not metadata:
            return "No additional metadata"

        lines = []
        for key, value in metadata.items():
            lines.append(f"- **{key}:** {value}")

        return "\n".join(lines) if lines else "No additional metadata"
