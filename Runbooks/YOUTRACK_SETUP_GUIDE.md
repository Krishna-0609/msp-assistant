# YouTrack Integration Setup Guide

## 🎯 What is YouTrack?

YouTrack is an issue tracking system by JetBrains that helps your team:
- ✅ Track all alerts as tickets
- ✅ Assign issues to team members
- ✅ Monitor progress and status
- ✅ Link alerts to issues
- ✅ Generate reports from tickets
- ✅ Integrate with Slack/Teams

**Key Benefits:**
- Automatic ticket creation from alerts
- Track resolution time
- Team collaboration on issues
- Historical tracking of problems
- Custom workflows and statuses

---

## 🚀 Step 1: Get YouTrack Instance (10 minutes)

### Option A: Cloud (Recommended for Quick Setup)

1. Go to https://www.jetbrains.com/youtrack/
2. Click **"Get Started"** → **"Cloud"**
3. Sign in with JetBrains account (or create one)
4. Create a new cloud instance
   - Instance name: `msp-assistant`
   - Type: `Professional` (30-day free trial available)
5. Wait for instance to initialize (~2 minutes)
6. Access your instance at: `https://your-instance-name.youtrack.cloud`

### Option B: Self-Hosted (Docker)

```bash
# Create container
docker run -d \
  -p 8080:8080 \
  --name youtrack \
  -v youtrack-data:/opt/youtrack/data \
  jetbrains/youtrack:latest

# Access at: http://localhost:8080
```

### Option C: On-Premises

Download from https://www.jetbrains.com/youtrack/download/ and follow installation guide for your OS.

---

## 🔑 Step 2: Create API Token (5 minutes)

Once you have YouTrack running:

### 2.1 Navigate to Settings

1. Click your **profile icon** (top right)
2. Select **"Settings"**
3. Click **"API tokens"** in left sidebar

### 2.2 Generate New Token

1. Click **"New token"**
2. Enter token name: `msp-assistant-integration`
3. **Important**: Select these permissions:
   - ☑ Read issues
   - ☑ Write issues
   - ☑ Create issues
   - ☑ Comment on issues
   - ☑ Read issue visibility restrictions
   - ☑ Write issue visibility restrictions
4. Click **"Create token"**
5. **COPY THE TOKEN** (you won't see it again!)

**Example token:** `pltxx3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## 🏗️ Step 3: Create Project (5 minutes)

### 3.1 Create MSP Project

1. From YouTrack home, click **"New Project"**
2. Fill in details:
   - Project name: `MSP Assistant`
   - Project key: `MSP` (this appears in ticket IDs)
   - Category: `Issue Tracking`
   - Type: `Standalone`
3. Click **"Create"**

### 3.2 Configure Issue Types

1. In MSP project, click **"Project Settings"**
2. Go to **"Issue Types"** (left sidebar)
3. Verify these types exist (they should by default):
   - Bug
   - Feature
   - Task
   - Improvement

### 3.3 Set Up Custom Fields (Optional)

For better organization, add custom fields:

1. Click **"Custom Fields"** in Project Settings
2. Click **"Create new custom field"**
3. Create these fields:

**Field 1: Alert Type**
- Name: `Alert Type`
- Type: `Enum`
- Values:
  - `cost_spike`
  - `vulnerability`
  - `performance`
  - `compliance`
  - `security`

**Field 2: AWS Service**
- Name: `AWS Service`
- Type: `Enum`
- Values:
  - `EC2`
  - `S3`
  - `RDS`
  - `Lambda`
  - `DynamoDB`
  - `etc...`

**Field 3: AWS Account**
- Name: `AWS Account`
- Type: `Text`

---

## 🔧 Step 4: Configure MSP Assistant (5 minutes)

### 4.1 Update .env File

Edit `backend/.env` and replace YouTrack placeholders:

```bash
# YouTrack Integration
YOUTRACK_URL=https://your-instance-name.youtrack.cloud
YOUTRACK_TOKEN=pltxx3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
YOUTRACK_PROJECT=MSP
YOUTRACK_ISSUE_LINK_BASE=https://your-instance-name.youtrack.cloud/issues
```

**How to find your values:**

| Value | Where to Find |
|-------|---------------|
| `YOUTRACK_URL` | Your YouTrack instance address (from Step 1) |
| `YOUTRACK_TOKEN` | Generated in Step 2 |
| `YOUTRACK_PROJECT` | Project key from Step 3 (default: `MSP`) |
| `YOUTRACK_ISSUE_LINK_BASE` | Your YouTrack URL + `/issues` |

### 4.2 Restart Backend

```bash
# Stop backend (Ctrl+C in terminal where it's running)

# Restart
cd backend
python -m uvicorn app.main:app --reload
```

---

## 🧪 Step 5: Test YouTrack Integration (5 minutes)

### 5.1 Test Connection

```bash
# Terminal command to test
curl -X POST http://localhost:8000/api/youtrack/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# Expected response (success):
# {
#   "configured": true,
#   "status": "success",
#   "message": "Connected to YouTrack as your-username"
# }
```

### 5.2 Create Test Ticket

```bash
# Via API
curl -X POST http://localhost:8000/api/youtrack/issues \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Ticket from MSP Assistant",
    "description": "This is a test ticket to verify YouTrack integration",
    "issue_type": "Task",
    "priority": "Normal",
    "tags": ["test", "integration"]
  }'

# Expected response:
# {
#   "success": true,
#   "issue_id": "MSP-1",
#   "url": "https://your-instance.youtrack.cloud/issues/MSP-1"
# }
```

### 5.3 View in YouTrack

1. Go to your YouTrack instance
2. Click on **MSP** project
3. You should see **MSP-1** with your test ticket
4. Click it to verify details

---

## 📊 Step 6: Configure Alert-Based Tickets (10 minutes)

The system can automatically create tickets when alerts occur:

### 6.1 Update Alerts Service

The alerts system automatically creates YouTrack tickets. Edit `backend/app/services/monitoring.py`:

```python
# When sending alert, also create YouTrack ticket
from app.services.youtrack_service import YouTrackService

youtrack = YouTrackService()

async def send_alert(alert_data):
    # Send Teams/Slack notification
    await send_teams_notification(alert_data)
    
    # Create YouTrack ticket
    issue = await youtrack.create_alert_issue(
        alert_type=alert_data["type"],
        severity=alert_data["severity"],
        service=alert_data["service"],
        message=alert_data["message"],
        account_id=alert_data.get("account_id"),
        metadata=alert_data.get("metadata")
    )
    
    if issue["success"]:
        logger.info(f"Created ticket: {issue['issue_id']}")
```

### 6.2 Map Severity to Priority

The integration automatically maps:

```
CRITICAL   → Critical priority
HIGH       → High priority
MEDIUM     → Normal priority
LOW        → Low priority
```

### 6.3 Automatic Tagging

Tickets are automatically tagged with:
- Alert type (e.g., `cost_spike`, `vulnerability`)
- Severity level (e.g., `critical`, `high`)
- Service name (e.g., `ec2`, `s3`)
- Account ID

---

## 🔄 Step 7: Integration Workflows (Optional)

### 7.1 Auto-Create Ticket from Cost Spike

**When:** Cost increases > 50%

```python
# In backend/app/services/monitoring.py

async def detect_cost_spike():
    # Check costs
    if cost_increase > 50:
        # Create alert
        alert = {
            "type": "cost_spike",
            "severity": "HIGH",
            "service": "EC2",
            "message": f"Cost increased {cost_increase}%"
        }
        
        # This automatically creates YouTrack ticket via webhook
        await send_alert(alert)
```

### 7.2 Auto-Create Ticket from Security Alert

**When:** Vulnerability found

```python
async def detect_security_issue():
    # Check Security Hub
    if vulnerability_found:
        alert = {
            "type": "vulnerability",
            "severity": "CRITICAL",
            "service": service_name,
            "message": vulnerability_description
        }
        
        # Creates YouTrack ticket
        await send_alert(alert)
```

### 7.3 Auto-Create Ticket from Performance Alert

**When:** CPU/Memory > threshold

```python
async def detect_performance_issue():
    # Check CloudWatch
    if cpu_usage > 90 or memory_usage > 90:
        alert = {
            "type": "performance",
            "severity": "HIGH",
            "service": service_name,
            "message": f"CPU: {cpu_usage}%, Memory: {memory_usage}%"
        }
        
        # Creates YouTrack ticket
        await send_alert(alert)
```

---

## 📱 Step 8: Team Integration (Optional)

### 8.1 Link YouTrack to Slack

1. In YouTrack, go to **Integrations**
2. Click **"Slack"**
3. Click **"Connect Slack workspace"**
4. Authorize YouTrack app
5. Select channel for notifications
6. Now tickets appear in Slack automatically

### 8.2 Link YouTrack to Teams (via Webhooks)

Teams integration is handled via the Teams webhook that posts links to tickets.

When a ticket is created, Teams message includes:
- Ticket ID and link
- Priority and severity
- Service affected
- Alert message
- "View in YouTrack" button

---

## 📈 Step 9: Monitoring Ticket Creation

### 9.1 Check Ticket Creation Logs

```bash
# View recent tickets created
curl http://localhost:8000/api/youtrack/search \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "created >= -1 day",
    "limit": 20
  }'

# Response shows recent tickets
```

### 9.2 Monitor Integration Health

```bash
# Test connection regularly
curl http://localhost:8000/api/youtrack/config \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Should show configuration status
```

### 9.3 Track Issue Resolution

In YouTrack dashboard:
1. Click **"Reports"**
2. Select **"Time to Resolution"**
3. See average time to close issues
4. Identify slow-to-resolve issues

---

## 🎯 Common Workflows

### Workflow 1: Cost Spike → Ticket → Resolution

```
Cost Spike Alert
    ↓
YouTrack Ticket Created (MSP-123)
    ↓
Teams Notification with ticket link
    ↓
Team investigates (comment in YouTrack)
    ↓
Issue resolved, ticket closed
    ↓
Report shows resolution time
```

### Workflow 2: Security Issue → Ticket → Remediation

```
Security Alert
    ↓
YouTrack Ticket (Critical, tagged: vulnerability, security)
    ↓
Slack/Teams notification
    ↓
Security team assigned
    ↓
Remediation steps added as comments
    ↓
Verified and closed
```

### Workflow 3: Performance Alert → Ticket → Scaling

```
High CPU/Memory Alert
    ↓
YouTrack Ticket (High priority, performance tag)
    ↓
DevOps team notified
    ↓
Infrastructure scaled up
    ↓
Ticket closed with resolution details
```

---

## 🔍 Advanced Features

### Search Issues

```bash
# Find all critical issues
curl -X POST http://localhost:8000/api/youtrack/search \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "priority: Critical AND created >= -1 week",
    "limit": 50
  }'
```

### Add Comment to Ticket

```bash
curl -X POST http://localhost:8000/api/youtrack/issues/MSP-123/comments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "Fixed the issue by optimizing EC2 instances"
  }'
```

### Update Issue Status

```bash
curl -X PUT http://localhost:8000/api/youtrack/issues/MSP-123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Resolved",
    "priority": "Low"
  }'
```

---

## ⚠️ Troubleshooting

### Issue: "Connection failed" when testing

**Solution:**
1. Verify YouTrack instance is running
2. Check `YOUTRACK_URL` in .env (should start with https://)
3. Verify API token is correct and not expired
4. Check network connectivity to YouTrack

```bash
# Test connectivity
curl https://your-instance.youtrack.cloud/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Issue: "Authentication failed"

**Solution:**
1. Verify token permissions include "Create issues"
2. Generate new token and update .env
3. Restart backend

```bash
# Check token validity
curl -v https://your-instance.youtrack.cloud/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Issue: Tickets not being created

**Solution:**
1. Check backend logs for errors
2. Verify project key matches (should be `MSP`)
3. Test API endpoint manually

```bash
# Check backend logs
tail -f backend/logs/app.log | grep youtrack
```

### Issue: Can't access YouTrack UI

**Solution:**
- For Cloud: Check https://your-instance.youtrack.cloud
- For Docker: Check http://localhost:8080
- Verify instance is running and healthy

---

## 📊 Dashboard Setup

### Create YouTrack Dashboard

1. In YouTrack, click **"Dashboards"** → **"Create Dashboard"**
2. Name it: `MSP Assistant Alerts`
3. Add these widgets:

**Widget 1: Critical Issues**
```
Query: priority: Critical AND state: "Submitted" 
Display: List of unresolved critical tickets
```

**Widget 2: Recent Issues**
```
Query: created >= -1 day 
Display: All issues created today
```

**Widget 3: By Service**
```
Query: group by "AWS Service"
Display: Count of issues per service
```

**Widget 4: By Status**
```
Query: group by state
Display: Pie chart of issue statuses
```

---

## 📞 Support & Resources

**YouTrack Documentation:**
- https://www.jetbrains.com/help/youtrack/
- https://www.jetbrains.com/help/youtrack/api/

**API Endpoints Reference:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/youtrack/config` | GET | Check configuration |
| `/api/youtrack/test` | POST | Test connection |
| `/api/youtrack/issues` | POST | Create issue |
| `/api/youtrack/issues/from-alert` | POST | Create from alert |
| `/api/youtrack/issues/{id}` | GET | Get issue details |
| `/api/youtrack/issues/{id}` | PUT | Update issue |
| `/api/youtrack/issues/{id}/comments` | POST | Add comment |
| `/api/youtrack/search` | POST | Search issues |
| `/api/youtrack/docs` | GET | Setup documentation |

---

## ✅ Setup Checklist

```
□ YouTrack instance created (cloud or self-hosted)
□ API token generated
□ MSP project created
□ Custom fields configured (optional)
□ .env updated with YouTrack credentials
□ Backend restarted
□ Connection test passed
□ Test ticket created successfully
□ YouTrack UI shows ticket
□ Slack/Teams integration configured
□ Monitoring dashboards created
□ Team trained on workflows
```

---

**YouTrack Integration Complete! ✅**

Now your system automatically creates tickets for all alerts, helping your team track and resolve issues faster.

