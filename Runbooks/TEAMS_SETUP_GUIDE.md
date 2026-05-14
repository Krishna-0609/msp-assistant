# Microsoft Teams Webhook Setup Guide

## Step 1: Create a Teams Channel
1. Open Microsoft Teams
2. Go to your team and create a new channel (or use existing one)
3. Name it something like `#msp-alerts` or `#aws-monitoring`

## Step 2: Add Incoming Webhook Connector

### For Microsoft Teams:
1. Click **⋯ (More options)** next to the channel name
2. Select **Connectors**
3. Search for **Incoming Webhook**
4. Click **Configure**
5. Give it a name: `MSP Assistant Alerts`
6. Optionally upload an image for the webhook
7. Click **Create**
8. **Copy the webhook URL** (this is your `TEAMS_WEBHOOK_URL`)
9. Click **Done**

## Step 3: Add Webhook URL to Backend

Update your `.env` file:
```
TEAMS_WEBHOOK_URL=https://outlook.webhook.office.com/webhookb2/xxxxxxx...
```

## Step 4: Test the Integration

The system will automatically send alerts for:
- **Cost Spikes**: When costs exceed threshold (30% increase by default)
- **Security Findings**: Critical vulnerabilities detected
- **Performance Issues**: High CPU/memory utilization

## Alert Types & Severity Levels

| Severity | Color | Use Case |
|----------|-------|----------|
| **CRITICAL** | 🔴 Red | Security breaches, severe cost spikes (>50%), service outages |
| **HIGH** | 🟠 Orange | Cost anomalies (>30%), high utilization (>90%) |
| **MEDIUM** | 🟡 Yellow | Performance warnings, moderate issues |
| **LOW** | 🟢 Green | Informational, routine checks |

## Sample Alert Message

When a cost spike is detected, you'll receive:

```
🚨 COST_SPIKE
Severity: HIGH
Service: EC2
Message: Cost spike detected: 45.2% increase
Time: 2026-05-14T21:45:00Z

[View in Dashboard] button
```

## Webhook URL Format

Microsoft Teams webhook URLs follow this format:
```
https://outlook.webhook.office.com/webhookb2/{organization-id}@{tenant-id}/IncomingWebhook/{channel-id}/{webhook-key}
```

## Troubleshooting

### Webhook Not Receiving Messages
1. Verify webhook URL is correct in `.env`
2. Check backend logs: `tail -f logs/app.log`
3. Ensure backend has internet connectivity to Teams service
4. Teams channel still exists and connector is active

### Messages Not Formatting Correctly
- The system uses Adaptive Cards (supported in all Teams versions)
- Check that TEAMS_WEBHOOK_URL starts with `https://outlook.webhook.office.com`

### Too Many/Too Few Alerts
- Adjust thresholds in monitoring service:
  - Cost spike threshold: `threshold_percent=30` (in monitoring.py)
  - Performance threshold: `if metric['maximum'] > 80` (in monitoring.py)

## Testing Webhook Manually

You can test your webhook with curl:
```bash
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"text":"Test alert from MSP Assistant"}' \
  'YOUR_TEAMS_WEBHOOK_URL'
```

## Production Configuration

For production:
1. Use AWS Secrets Manager to store webhook URL (don't commit to repo)
2. Rotate webhook URLs periodically
3. Monitor webhook failures and set up alerting
4. Implement webhook retry logic with exponential backoff
