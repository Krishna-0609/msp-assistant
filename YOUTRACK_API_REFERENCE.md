# YouTrack API Reference

## Base URL
```
http://localhost:8000/api/youtrack
```

## Authentication
All requests require JWT Bearer token:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Configuration Endpoints

### Get Configuration Status
```
GET /api/youtrack/config
```

**Response (Success):**
```json
{
  "configured": true,
  "project": "MSP",
  "base_url": "https://your-instance.youtrack.cloud"
}
```

**Response (Not Configured):**
```json
{
  "configured": false,
  "project": null,
  "base_url": null
}
```

---

### Test Connection
```
POST /api/youtrack/test
```

**Response (Success):**
```json
{
  "configured": true,
  "status": "success",
  "message": "Connected to YouTrack as john.doe",
  "user": {
    "login": "john.doe",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response (Failure):**
```json
{
  "configured": true,
  "status": "error",
  "message": "Authentication failed: 401"
}
```

---

## Issue Management Endpoints

### Create Issue
```
POST /api/youtrack/issues
```

**Request Body:**
```json
{
  "title": "EC2 Instance Cost Spike",
  "description": "Detailed description of the issue",
  "issue_type": "Bug",
  "priority": "High",
  "tags": ["cost", "ec2", "urgent"]
}
```

**Response (Success):**
```json
{
  "success": true,
  "issue_id": "MSP-123",
  "issue": {
    "id": "MSP-123",
    "summary": "EC2 Instance Cost Spike",
    "state": "Submitted",
    "priority": "High"
  },
  "url": "https://your-instance.youtrack.cloud/issues/MSP-123"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": "Project not found or invalid configuration",
  "issue": null
}
```

---

### Create Alert-Based Issue
```
POST /api/youtrack/issues/from-alert
```

**Request Body:**
```json
{
  "alert_type": "cost_spike",
  "severity": "CRITICAL",
  "service": "EC2",
  "message": "Cost increased 65% compared to last week",
  "account_id": "123456789012",
  "metadata": {
    "previous_cost": "$5000",
    "current_cost": "$8250",
    "increase_percent": 65,
    "detected_time": "2026-05-14T15:30:00Z"
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "issue_id": "MSP-124",
  "issue": {
    "id": "MSP-124",
    "summary": "[COST_SPIKE] CRITICAL - EC2 - Cost increased 65%...",
    "description": "Detailed alert information",
    "state": "Submitted",
    "priority": "Critical",
    "tags": ["cost_spike", "critical", "ec2", "123456789012"]
  },
  "url": "https://your-instance.youtrack.cloud/issues/MSP-124"
}
```

---

### Get Issue Details
```
GET /api/youtrack/issues/{issue_id}
```

**Example:**
```
GET /api/youtrack/issues/MSP-123
```

**Response (Success):**
```json
{
  "success": true,
  "issue": {
    "id": "MSP-123",
    "summary": "EC2 Instance Cost Spike",
    "description": "...",
    "created": "2026-05-14T10:00:00Z",
    "updated": "2026-05-14T15:30:00Z",
    "state": "Submitted",
    "priority": "High",
    "assignee": {
      "login": "john.doe",
      "fullName": "John Doe"
    },
    "tags": ["cost", "ec2"]
  }
}
```

**Response (Not Found):**
```json
{
  "success": false,
  "error": "Issue not found: 404",
  "issue": null
}
```

---

### Update Issue
```
PUT /api/youtrack/issues/{issue_id}
```

**Request Body:**
```json
{
  "status": "In Progress",
  "priority": "Normal",
  "assignee": "john.doe",
  "description": "Updated description"
}
```

**Response (Success):**
```json
{
  "success": true,
  "issue_id": "MSP-123"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": "Failed to update issue: 400"
}
```

---

## Comments & Discussion

### Add Comment to Issue
```
POST /api/youtrack/issues/{issue_id}/comments
```

**Request Body:**
```json
{
  "comment": "Fixed by optimizing EC2 reserved instances. Estimated savings: $500/month"
}
```

**Response (Success):**
```json
{
  "success": true,
  "issue_id": "MSP-123"
}
```

---

## Search & Query

### Search Issues
```
POST /api/youtrack/search
```

**Request Body:**
```json
{
  "query": "priority: Critical AND created >= -1 week",
  "limit": 20
}
```

**Response:**
```json
{
  "success": true,
  "issues": [
    {
      "id": "MSP-120",
      "summary": "Critical Security Vulnerability",
      "created": "2026-05-12T08:00:00Z",
      "updated": "2026-05-14T10:00:00Z",
      "state": "In Progress"
    },
    {
      "id": "MSP-121",
      "summary": "High CPU Usage Alert",
      "created": "2026-05-13T14:00:00Z",
      "updated": "2026-05-13T16:00:00Z",
      "state": "Resolved"
    }
  ],
  "count": 2
}
```

**Common Queries:**

| Query | Purpose |
|-------|---------|
| `priority: Critical` | All critical issues |
| `state: "In Progress"` | Issues currently being worked on |
| `created >= -1 day` | Issues created in last 24 hours |
| `created >= -1 week` | Issues created in last 7 days |
| `type: Bug` | Only bug reports |
| `tag: cost_spike` | Issues with cost_spike tag |
| `assignee: john.doe` | Issues assigned to specific person |
| `priority: Critical AND state: Submitted` | Critical unassigned issues |

---

## Documentation

### Get Setup Documentation
```
GET /api/youtrack/docs
```

**Response:**
```json
{
  "title": "YouTrack Integration Setup Guide",
  "description": "How to set up and configure YouTrack integration",
  "steps": [
    {
      "step": 1,
      "title": "Get YouTrack Instance",
      "description": "Ensure you have a YouTrack instance running",
      "link": "https://www.jetbrains.com/youtrack/"
    },
    {
      "step": 2,
      "title": "Generate API Token",
      "description": "In YouTrack, go to Settings > API Tokens",
      "permissions": ["Read", "Write", "Create issues"]
    }
  ],
  "features": {
    "auto_tickets": "Automatically create tickets when critical alerts occur",
    "alert_linking": "Link alerts to YouTrack issues",
    "team_integration": "Assign to team members via YouTrack",
    "tracking": "Track issue status in YouTrack dashboard",
    "search": "Search and filter issues by various criteria"
  }
}
```

---

## Error Responses

### Common Errors

**400 - Bad Request**
```json
{
  "detail": {
    "success": false,
    "error": "Invalid request parameters"
  }
}
```

**401 - Unauthorized**
```json
{
  "detail": "Could not validate credentials"
}
```

**403 - Forbidden**
```json
{
  "detail": {
    "success": false,
    "error": "YouTrack not configured"
  }
}
```

**404 - Not Found**
```json
{
  "detail": {
    "success": false,
    "error": "Issue not found"
  }
}
```

**500 - Server Error**
```json
{
  "detail": {
    "success": false,
    "error": "Internal server error: Connection timeout"
  }
}
```

---

## Usage Examples

### Example 1: Create Issue from Alert in Python

```python
import requests
import json

BASE_URL = "http://localhost:8000"
TOKEN = "your-jwt-token"

# Create alert-based issue
headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

data = {
    "alert_type": "cost_spike",
    "severity": "CRITICAL",
    "service": "RDS",
    "message": "RDS costs increased 120%",
    "account_id": "123456789012",
    "metadata": {
        "previous_cost": "$1000",
        "current_cost": "$2200",
        "detected_by": "cost_anomaly_detector"
    }
}

response = requests.post(
    f"{BASE_URL}/api/youtrack/issues/from-alert",
    headers=headers,
    json=data
)

issue = response.json()
print(f"Created issue: {issue['issue_id']}")
print(f"View at: {issue['url']}")
```

### Example 2: Search and Update Issues in Python

```python
import requests

BASE_URL = "http://localhost:8000"
TOKEN = "your-jwt-token"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# Search for critical issues
search_data = {
    "query": "priority: Critical AND state: Submitted",
    "limit": 10
}

response = requests.post(
    f"{BASE_URL}/api/youtrack/search",
    headers=headers,
    json=search_data
)

issues = response.json()["issues"]

# Update first issue
if issues:
    issue_id = issues[0]["id"]
    
    update_data = {
        "status": "In Progress",
        "priority": "High"
    }
    
    requests.put(
        f"{BASE_URL}/api/youtrack/issues/{issue_id}",
        headers=headers,
        json=update_data
    )
    
    print(f"Updated {issue_id}")
```

### Example 3: Add Comment to Issue Using Curl

```bash
ISSUE_ID="MSP-123"
COMMENT="Resolved by implementing cost optimization"
TOKEN="your-jwt-token"

curl -X POST http://localhost:8000/api/youtrack/issues/$ISSUE_ID/comments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"comment\": \"$COMMENT\"}"
```

---

## Rate Limiting

- **Requests per minute**: 300
- **Concurrent connections**: 10
- **Timeout**: 30 seconds

---

## Webhook Integration

When an issue is created automatically from an alert, it includes:

**Teams Card Link:**
```
[View in YouTrack] → https://your-instance.youtrack.cloud/issues/MSP-123
```

**Slack Message:**
```
Created: MSP-123 - [COST_SPIKE] CRITICAL - EC2
View: https://your-instance.youtrack.cloud/issues/MSP-123
```

---

## Troubleshooting API Calls

### Test Configuration

```bash
curl http://localhost:8000/api/youtrack/config \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Connection

```bash
curl -X POST http://localhost:8000/api/youtrack/test \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Debug Issue Creation

```bash
curl -X POST http://localhost:8000/api/youtrack/issues \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "description": "Test issue",
    "issue_type": "Task",
    "priority": "Low"
  }' \
  -v  # verbose mode shows detailed response
```

---

## Next Steps

1. **Integrate with Alert System**
   - Modify alert handler to create YouTrack issues
   - Update monitoring service

2. **Set Up Workflows**
   - Configure automatic issue creation rules
   - Set up status transitions

3. **Team Training**
   - Train team on YouTrack dashboard
   - Document team processes

4. **Monitoring**
   - Monitor issue creation rates
   - Track resolution times
   - Generate reports

---

**API Reference Complete! ✅**

For more details, see `YOUTRACK_SETUP_GUIDE.md`

