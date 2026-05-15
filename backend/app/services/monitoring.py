"""24/7 Monitoring and Alerting Service"""

import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Any
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from app.core.config import settings
from app.services.aws_service import aws_service

logger = logging.getLogger(__name__)


def create_session_with_retries():
    """Create requests session with retry strategy"""
    session = requests.Session()
    retry_strategy = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["HEAD", "GET", "OPTIONS", "POST"],
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session


class MonitoringService:
    def __init__(self):
        self.alerts = []
        self.is_running = False

    async def send_teams_notification(self, alert: Dict[str, Any]) -> bool:
        """Send alert to Microsoft Teams with retry logic"""
        if (
            not settings.TEAMS_WEBHOOK_URL
            or "your-teams-webhook-url" in settings.TEAMS_WEBHOOK_URL
        ):
            logger.warning("Teams webhook URL not configured")
            return False

        try:
            severity_colors = {
                "critical": "ff0000",
                "high": "ff9900",
                "medium": "ffff00",
                "low": "00ff00",
            }

            color = severity_colors.get(alert.get("severity", "medium"), "0066ff")

            message = {
                "type": "message",
                "attachments": [
                    {
                        "contentType": "application/vnd.microsoft.card.adaptive",
                        "contentUrl": None,
                        "content": {
                            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                            "type": "AdaptiveCard",
                            "version": "1.4",
                            "body": [
                                {
                                    "type": "Container",
                                    "style": "accent",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": f"🚨 {alert.get('type', 'Alert').upper()}",
                                            "weight": "bolder",
                                            "size": "large",
                                            "color": "light",
                                        }
                                    ],
                                },
                                {
                                    "type": "Container",
                                    "items": [
                                        {
                                            "type": "FactSet",
                                            "facts": [
                                                {
                                                    "name": "Severity:",
                                                    "value": alert.get(
                                                        "severity", "unknown"
                                                    ).upper(),
                                                },
                                                {
                                                    "name": "Service:",
                                                    "value": alert.get(
                                                        "service", "N/A"
                                                    ),
                                                },
                                                {
                                                    "name": "Message:",
                                                    "value": alert.get("message", ""),
                                                },
                                                {
                                                    "name": "Time:",
                                                    "value": datetime.now().isoformat(),
                                                },
                                                {
                                                    "name": "Account:",
                                                    "value": alert.get(
                                                        "metadata", {}
                                                    ).get("account_id", "N/A"),
                                                },
                                            ],
                                        }
                                    ],
                                },
                            ],
                            "actions": [
                                {
                                    "type": "Action.OpenUrl",
                                    "title": "View in Dashboard",
                                    "url": "https://msp-assistant.example.com/alerts",
                                }
                            ],
                        },
                    }
                ],
            }

            session = create_session_with_retries()
            response = session.post(
                settings.TEAMS_WEBHOOK_URL, json=message, timeout=10
            )

            if response.status_code in [200, 204]:
                logger.info(
                    f"Teams notification sent successfully for {alert.get('type')}"
                )
                return True
            else:
                logger.error(
                    f"Teams webhook returned {response.status_code}: {response.text}"
                )
                return False

        except Exception as e:
            logger.error(f"Error sending Teams notification: {str(e)}")
            return False

    async def send_slack_notification(self, alert: Dict[str, Any]) -> bool:
        """Send alert to Slack"""
        if not settings.SLACK_WEBHOOK_URL:
            logger.warning("Slack webhook URL not configured")
            return False

        try:
            severity_emojis = {
                "critical": "🔴",
                "high": "🟠",
                "medium": "🟡",
                "low": "🟢",
            }

            emoji = severity_emojis.get(alert.get("severity", "medium"), "🔵")

            message = {
                "blocks": [
                    {
                        "type": "header",
                        "text": {
                            "type": "plain_text",
                            "text": f"{emoji} {alert.get('type', 'Alert').upper()}",
                        },
                    },
                    {
                        "type": "section",
                        "fields": [
                            {
                                "type": "mrkdwn",
                                "text": f"*Severity:*\n{alert.get('severity', 'unknown').upper()}",
                            },
                            {
                                "type": "mrkdwn",
                                "text": f"*Service:*\n{alert.get('service', 'N/A')}",
                            },
                        ],
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": f"*Message:*\n{alert.get('message', '')}",
                        },
                    },
                    {
                        "type": "actions",
                        "elements": [
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": "View in Dashboard",
                                },
                                "url": "http://localhost:3000/alerts",
                            }
                        ],
                    },
                ]
            }

            response = requests.post(
                settings.SLACK_WEBHOOK_URL, json=message, timeout=10
            )

            return response.status_code == 200

        except Exception as e:
            logger.error(f"Error sending Slack notification: {str(e)}")
            return False

    async def monitor_costs(self) -> List[Dict[str, Any]]:
        """Monitor costs and detect anomalies"""
        logger.info("Starting cost monitoring...")

        anomalies = await aws_service.detect_cost_anomalies(
            account_id="123456789012", threshold_percent=30
        )

        for anomaly in anomalies:
            alert = {
                "type": "cost_spike",
                "severity": anomaly["severity"],
                "message": f"Cost spike detected: {anomaly['percent_change']:.1f}% increase",
                "service": "Cost Analysis",
                "metadata": anomaly,
            }

            await self.send_teams_notification(alert)
            await self.send_slack_notification(alert)
            self.alerts.append(alert)

        return anomalies

    async def monitor_security(self) -> List[Dict[str, Any]]:
        """Monitor security findings"""
        logger.info("Starting security monitoring...")

        findings = await aws_service.get_security_findings(
            account_id="123456789012", severity="CRITICAL"
        )

        for finding in findings:
            alert = {
                "type": "vulnerability",
                "severity": "critical",
                "message": finding["title"],
                "service": finding["resource"],
                "metadata": finding,
            }

            await self.send_teams_notification(alert)
            await self.send_slack_notification(alert)
            self.alerts.append(alert)

        return findings

    async def monitor_performance(self) -> List[Dict[str, Any]]:
        """Monitor performance metrics"""
        logger.info("Starting performance monitoring...")

        metrics = await aws_service.get_performance_metrics(account_id="123456789012")

        for metric in metrics:
            if metric["maximum"] > 80:
                alert = {
                    "type": "performance",
                    "severity": "high" if metric["maximum"] > 90 else "medium",
                    "message": f"High CPU utilization detected: {metric['maximum']:.1f}%",
                    "service": "Performance",
                    "metadata": metric,
                }

                await self.send_teams_notification(alert)
                await self.send_slack_notification(alert)
                self.alerts.append(alert)

        return metrics

    async def start_monitoring(self, interval_seconds: int = 300):
        """Start continuous monitoring (runs every 5 minutes by default)"""
        self.is_running = True
        logger.info(f"Starting monitoring loop with {interval_seconds}s interval")

        while self.is_running:
            try:
                logger.info("Running monitoring checks...")

                await self.monitor_costs()
                await self.monitor_security()
                await self.monitor_performance()

                logger.info(f"Monitoring complete. Total alerts: {len(self.alerts)}")

            except Exception as e:
                logger.error(f"Error in monitoring loop: {str(e)}")

            await asyncio.sleep(interval_seconds)

    async def stop_monitoring(self):
        """Stop continuous monitoring"""
        self.is_running = False
        logger.info("Monitoring stopped")

    def get_alerts(self) -> List[Dict[str, Any]]:
        """Get all alerts"""
        return self.alerts

    def clear_alerts(self) -> None:
        """Clear all alerts"""
        self.alerts = []


# Global instance
monitoring_service = MonitoringService()
