# Microsoft Teams AWS Monitoring - Quick Start (5 Minutes)

## ⚡ 5-Minute Setup

### Step 1: Get Teams Webhook (2 minutes)

```
1. Open Microsoft Teams
2. Go to your team/channel
3. Click ⋮ (More options) → Connectors
4. Search "Incoming Webhook" → Configure
5. Name: "AWS Monitoring Bot"
6. Copy the webhook URL
7. Save securely in AWS Secrets Manager
```

### Step 2: Store in AWS (1 minute)

```bash
aws secretsmanager create-secret \
  --name prod/teams/aws-webhook \
  --secret-string "https://outlook.webhook.office.com/webhookb2/xxxxx"
```

### Step 3: Test Connection (1 minute)

```bash
# Get your webhook URL
WEBHOOK=$(aws secretsmanager get-secret-value \
  --secret-id prod/teams/aws-webhook \
  --query SecretString --output text)

# Send test message
curl -X POST -H 'Content-Type: application/json' \
  -d '{"text":"✅ AWS Monitoring Connected!"}' \
  "$WEBHOOK"
```

### Step 4: Deploy Lambda (1 minute)

```bash
# Create simple Lambda
cat > lambda_function.py << 'EOF'
import requests
import os

def lambda_handler(event, context):
    webhook = os.environ['TEAMS_WEBHOOK']
    
    payload = {
        "@type": "MessageCard",
        "summary": "AWS Alert",
        "themeColor": "0078D4",
        "sections": [{
            "activityTitle": "🔴 Critical Security Issue",
            "text": "Check AWS Security Hub immediately"
        }]
    }
    
    response = requests.post(webhook, json=payload)
    return {'statusCode': response.status_code}
EOF

# Deploy
zip lambda.zip lambda_function.py
aws lambda create-function \
  --function-name aws-teams-monitor \
  --runtime python3.11 \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://lambda.zip \
  --environment Variables="{TEAMS_WEBHOOK=$WEBHOOK}"
```

---

## 📊 What Gets Monitored

| Issue | Check Interval | When Alert Sent |
|-------|----------------|-----------------|
| 🔴 **Critical Security** | Every 5 min | New CRITICAL finding |
| 💰 **Cost Spike** | Every 1 hour | Increase > 30% |
| ⚡ **Performance** | Every 5 min | Latency > 500ms |
| 🔐 **Compliance** | Every 6 hours | Config rule failed |
| 📉 **Errors** | Every 5 min | Error rate > 1% |

---

## 💬 Example Alerts You'll See

### Alert 1: Security Finding
```
🔴 SECURITY ALERT
EC2 instance allows unrestricted SSH access
Resource: i-0ae8c2d9fbe67c6ab
Severity: CRITICAL
[Open Security Hub] [Auto-Remediate]
```

### Alert 2: Cost Spike
```
💰 COST ALERT
Daily costs jumped from $371 to $521 (+40%)
Top service: EC2 (+$150)
[View Cost Explorer] [Analyze]
```

### Alert 3: Performance Issue
```
⚡ PERFORMANCE ALERT
API latency: 650ms (normal: 200ms)
Error rate: 2.1% (normal: 0.1%)
[View Logs] [Restart Services]
```

---

## 🚀 One-Liner Deployment

```bash
# Copy this entire command to deploy everything:
aws s3 cp monitoring-stack.zip s3://my-bucket/ && \
aws cloudformation create-stack \
  --stack-name aws-monitoring \
  --template-body file://monitoring-template.yaml \
  --capabilities CAPABILITY_IAM
```

---

## 🎯 Customize Alerts

### Change Sensitivity

```bash
# More alerts (catch smaller issues)
COST_THRESHOLD=0.20  # Alert on 20% increase

# Fewer alerts (only critical)
COST_THRESHOLD=0.50  # Alert on 50% increase

# Update Lambda environment
aws lambda update-function-configuration \
  --function-name cost-monitor \
  --environment "Variables={THRESHOLD=0.30}"
```

### Add Custom Alert

```python
def send_custom_alert(title, message, severity):
    color = '#FF0000' if severity == 'CRITICAL' else '#FFA500'
    
    payload = {
        "@type": "MessageCard",
        "themeColor": color,
        "sections": [{
            "activityTitle": title,
            "text": message
        }]
    }
    
    requests.post(os.environ['TEAMS_WEBHOOK'], json=payload)

# Use it:
send_custom_alert(
    "🔍 Policy Change Detected",
    "S3 bucket public access policy modified",
    "CRITICAL"
)
```

---

## ✅ Verification Checklist

- [ ] Teams webhook URL obtained
- [ ] Webhook stored in Secrets Manager
- [ ] Test alert received in Teams
- [ ] Lambda function deployed
- [ ] EventBridge rules created (5-min intervals)
- [ ] SNS topics configured
- [ ] Alerts appearing in Teams channel
- [ ] Team members can see alerts

---

## 🛠️ Troubleshooting

### **Problem:** No alerts in Teams
```bash
# 1. Check webhook is correct
aws secretsmanager get-secret-value --secret-id prod/teams/aws-webhook

# 2. Test webhook manually
curl -X POST -H 'Content-Type: application/json' \
  -d '{"text":"TEST"}' "$(aws secretsmanager get-secret-value --secret-id prod/teams/aws-webhook --query SecretString --output text)"

# 3. Check Lambda logs
aws logs tail /aws/lambda/aws-teams-monitor --follow

# 4. Verify Lambda has internet (needs NAT or VPC endpoint)
```

### **Problem:** Too many alerts
```bash
# Increase thresholds in Lambda environment:
aws lambda update-function-configuration \
  --function-name cost-monitor \
  --environment "Variables={COST_THRESHOLD=0.5}"
```

### **Problem:** Missing specific alert type
```bash
# Enable Security Hub:
aws securityhub enable-security-hub

# Or check if Lambda is actually running:
aws lambda invoke \
  --function-name vulnerability-scanner \
  --log-type Tail \
  response.json
cat response.json
```

---

## 💡 Pro Tips

**Tip 1:** Use different Teams channels for different alert types
```
#aws-critical → Only CRITICAL alerts
#aws-billing → Cost alerts only
#aws-performance → Performance metrics
```

**Tip 2:** Auto-remediate low-risk issues
```python
# Remove public SSH access automatically
ec2.revoke_security_group_ingress(
    GroupId=sg_id,
    IpPermissions=[{
        'IpProtocol': 'tcp',
        'FromPort': 22,
        'ToPort': 22,
        'IpRanges': [{'CidrIp': '0.0.0.0/0'}]
    }]
)
```

**Tip 3:** Add runbook links to alerts
```python
"potentialAction": [{
    "name": "Open Runbook",
    "targets": [{
        "uri": "https://wiki.company.com/aws-critical-response"
    }]
}]
```

**Tip 4:** Track alert metrics
```python
# Count alerts by type
cloudwatch.put_metric_data(
    Namespace='AWS/Monitoring',
    MetricData=[{
        'MetricName': 'AlertsCreated',
        'Value': 1,
        'Dimensions': [{'Name': 'Type', 'Value': 'SecurityFinding'}]
    }]
)
```

---

## 📈 Monitoring Cost

| Component | Cost | Example |
|-----------|------|---------|
| Lambda invocations | ~$0.00 | 288/day |
| CloudWatch logs | ~$0.50/mo | < 1 GB |
| SNS notifications | ~$0.00 | < 1000/mo |
| **Total** | **~$1/mo** | **Extremely cheap** |

---

## 🔄 Full Monitoring Loop

```
AWS Account
    ↓ (EventBridge rule runs every 5 min)
Lambda Function
    ↓ (Checks for issues)
SNS Topic
    ↓ (Routes alert)
Lambda Alert Processor
    ↓ (Formats for Teams)
Microsoft Teams
    ↓ (Notification sent)
Your Team Channel
    ↓ (Team reacts/investigates)
AWS Console
    ↓ (Fix issue)
Back to Normal
```

---

## 🎓 Next Steps

1. **Immediate (Now):**
   - Get Teams webhook
   - Deploy Lambda
   - Test alert

2. **Today:**
   - Setup 5 monitoring checks
   - Configure alert thresholds
   - Add team members

3. **This Week:**
   - Enable auto-remediation
   - Create runbooks
   - Fine-tune alerts

4. **Ongoing:**
   - Review alerts daily
   - Adjust thresholds
   - Add more checks

---

## 📞 Support

**Issue:** Webhook not working
- Check URL is valid: https://outlook.webhook.office.com/webhookb2/xxxxx
- Verify Teams channel still exists
- Regenerate webhook URL

**Issue:** Lambda times out
- Increase timeout: 30 seconds (default)
- Check if querying large dataset
- Add pagination/limits to queries

**Issue:** Missing alerts
- Check EventBridge rule is enabled
- Verify Lambda execution role has permissions
- Check CloudWatch logs for errors

---

## 🎉 What You Now Have

✅ **Vulnerability Scanner** - Every 5 minutes  
✅ **Cost Spike Detector** - Every hour  
✅ **Performance Monitor** - Every 5 minutes  
✅ **Compliance Checker** - Every 6 hours  
✅ **Teams Notifications** - Instant  
✅ **24/7 Coverage** - Weekends included  
✅ **Cost Effective** - ~$1/month  

**Your AWS account is now monitored 24/7! 🔒**

---

## 📋 Command Reference

```bash
# Get webhook
aws secretsmanager get-secret-value --secret-id prod/teams/aws-webhook

# Test webhook
curl -X POST -H 'Content-Type: application/json' -d '{"text":"test"}' <WEBHOOK_URL>

# Deploy Lambda
aws lambda create-function --function-name monitor --runtime python3.11 --handler lambda.handler --zip-file fileb://lambda.zip

# Create EventBridge rule
aws events put-rule --name scan-5min --schedule-expression "rate(5 minutes)"

# Test Lambda
aws lambda invoke --function-name monitor response.json && cat response.json

# View logs
aws logs tail /aws/lambda/monitor --follow

# Enable debug
aws lambda update-function-configuration --function-name monitor --environment Variables={DEBUG=true}
```

---

**Total Setup Time:** ~15-30 minutes  
**Total Monthly Cost:** ~$1-2  
**Peace of Mind:** Priceless 😊

Start now! Get your Teams webhook and follow the 5 steps above.
