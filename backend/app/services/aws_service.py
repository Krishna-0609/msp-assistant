"""AWS Services integration"""
import boto3
import json
import logging
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from app.core.config import settings
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

class AWSService:
    def __init__(self):
        try:
            # Use AWS Profile if configured, otherwise use IAM credentials
            session_kwargs = {'region_name': settings.AWS_REGION}
            if hasattr(settings, 'AWS_PROFILE') and settings.AWS_PROFILE:
                session = boto3.Session(profile_name=settings.AWS_PROFILE, region_name=settings.AWS_REGION)
            else:
                session = boto3.Session(
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID or None,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY or None,
                    region_name=settings.AWS_REGION
                )

            self.ce_client = session.client('ce')
            self.s3_client = session.client('s3')
            self.dynamodb = session.resource('dynamodb')
            self.cloudwatch = session.client('cloudwatch')
            self.security_hub = session.client('securityhub')
            self.cost_anomaly = session.client('ce')
            logger.info("AWS Services initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize AWS services: {str(e)}")
            raise

    async def get_costs(
        self,
        account_id: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get AWS costs using Cost Explorer"""
        try:
            if not start_date:
                start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
            if not end_date:
                end_date = datetime.now().strftime('%Y-%m-%d')

            response = self.ce_client.get_cost_and_usage(
                TimePeriod={
                    'Start': start_date,
                    'End': end_date
                },
                Granularity='MONTHLY',
                Metrics=['UnblendedCost'],
                GroupBy=[
                    {
                        'Type': 'DIMENSION',
                        'Key': 'SERVICE'
                    }
                ]
            )

            costs = []
            for item in response.get('ResultsByTime', []):
                for group in item.get('Groups', []):
                    service = group['Keys'][0]
                    amount = float(group['Metrics']['UnblendedCost']['Amount'])
                    costs.append({
                        'service': service,
                        'amount': amount,
                        'date': item['TimePeriod']['Start'],
                        'account_id': account_id
                    })

            logger.info(f"Retrieved costs for account {account_id}")
            return costs

        except Exception as e:
            logger.error(f"Error getting costs: {str(e)}")
            return []

    async def detect_cost_anomalies(
        self,
        account_id: str,
        threshold_percent: float = 30
    ) -> List[Dict[str, Any]]:
        """Detect cost anomalies using AWS Anomaly Detector"""
        try:
            response = self.cloudwatch.get_metric_statistics(
                Namespace='AWS/Billing',
                MetricName='EstimatedCharges',
                StartTime=datetime.now() - timedelta(days=30),
                EndTime=datetime.now(),
                Period=86400,
                Statistics=['Average']
            )

            anomalies = []
            datapoints = sorted(response['Datapoints'], key=lambda x: x['Timestamp'])

            if len(datapoints) > 1:
                baseline = sum(d['Average'] for d in datapoints[:-1]) / len(datapoints[:-1])
                latest = datapoints[-1]['Average']
                percent_change = ((latest - baseline) / baseline) * 100

                if percent_change > threshold_percent:
                    anomalies.append({
                        'type': 'cost_spike',
                        'severity': 'high' if percent_change > 50 else 'medium',
                        'percent_change': percent_change,
                        'baseline': baseline,
                        'current': latest,
                        'account_id': account_id
                    })

            logger.info(f"Detected {len(anomalies)} cost anomalies")
            return anomalies

        except Exception as e:
            logger.error(f"Error detecting anomalies: {str(e)}")
            return []

    async def get_security_findings(
        self,
        account_id: str,
        severity: str = 'CRITICAL'
    ) -> List[Dict[str, Any]]:
        """Get security findings from Security Hub"""
        try:
            response = self.security_hub.get_findings(
                Filters={
                    'SeverityLabel': [
                        {
                            'Value': severity,
                            'Comparison': 'EQUALS'
                        }
                    ],
                    'RecordState': [
                        {
                            'Value': 'ACTIVE',
                            'Comparison': 'EQUALS'
                        }
                    ]
                }
            )

            findings = []
            for finding in response.get('Findings', []):
                findings.append({
                    'id': finding['Id'],
                    'type': finding['Type'],
                    'title': finding['Title'],
                    'description': finding['Description'],
                    'severity': finding['Severity']['Label'],
                    'resource': finding['Resources'][0]['Id'],
                    'account_id': account_id
                })

            logger.info(f"Retrieved {len(findings)} security findings")
            return findings

        except Exception as e:
            logger.error(f"Error getting security findings: {str(e)}")
            return []

    async def get_performance_metrics(
        self,
        account_id: str,
        metric_name: str = 'CPUUtilization'
    ) -> List[Dict[str, Any]]:
        """Get performance metrics from CloudWatch"""
        try:
            response = self.cloudwatch.get_metric_statistics(
                Namespace='AWS/EC2',
                MetricName=metric_name,
                StartTime=datetime.now() - timedelta(hours=1),
                EndTime=datetime.now(),
                Period=300,
                Statistics=['Average', 'Maximum']
            )

            metrics = []
            for datapoint in response['Datapoints']:
                metrics.append({
                    'metric': metric_name,
                    'average': datapoint.get('Average', 0),
                    'maximum': datapoint.get('Maximum', 0),
                    'timestamp': datapoint['Timestamp'].isoformat(),
                    'account_id': account_id
                })

            logger.info(f"Retrieved performance metrics")
            return metrics

        except Exception as e:
            logger.error(f"Error getting performance metrics: {str(e)}")
            return []

    async def store_cost_in_dynamodb(self, cost_data: Dict[str, Any]) -> bool:
        """Store cost data in DynamoDB"""
        try:
            table = self.dynamodb.Table(settings.DYNAMODB_TABLE_COSTS)
            table.put_item(Item=cost_data)
            logger.info(f"Stored cost data in DynamoDB")
            return True
        except Exception as e:
            logger.error(f"Error storing cost data: {str(e)}")
            return False

    async def store_alert_in_dynamodb(self, alert_data: Dict[str, Any]) -> bool:
        """Store alert in DynamoDB"""
        try:
            table = self.dynamodb.Table(settings.DYNAMODB_TABLE_ALERTS)
            table.put_item(Item=alert_data)
            logger.info(f"Stored alert in DynamoDB")
            return True
        except Exception as e:
            logger.error(f"Error storing alert: {str(e)}")
            return False

# Global instance
aws_service = AWSService()
