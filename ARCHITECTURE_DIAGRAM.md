# System Architecture & Integration Diagrams

## 🏗️ Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MSP ASSISTANT SYSTEM                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────┐
│     LOCAL DEVELOPMENT (Port 3001)      │
├────────────────────────────────────────┤
│  React Frontend (TypeScript + Vite)    │
│  ├─ Login Page                         │
│  ├─ Dashboard                          │
│  ├─ Costs Page                         │
│  ├─ Alerts Page                        │
│  ├─ Chat Page (AI)                     │
│  ├─ Reports Page                       │
│  └─ Admin Panel                        │
└────────────────────────────────────────┘
           │
           │ HTTP/HTTPS
           ▼
┌────────────────────────────────────────┐
│   LOCAL BACKEND (Port 8000)            │
├────────────────────────────────────────┤
│  FastAPI (Python 3.11)                 │
│  ├─ Authentication API                 │
│  ├─ Costs API                          │
│  ├─ Alerts API                         │
│  ├─ Chat API (Bedrock)                 │
│  ├─ Reports API                        │
│  ├─ Webhooks API                       │
│  ├─ YouTrack API         ◄── NEW       │
│  └─ Accounts API                       │
└────────────────────────────────────────┘
    │        │         │         │
    │        │         │         └────────────────┐
    │        │         │                         │
    ▼        ▼         ▼                         ▼
┌───────┐ ┌──────┐ ┌──────────┐    ┌──────────────────────┐
│  AWS  │ │Teams │ │ YouTrack │    │  SQLite (Local Dev)  │
│Services│ │Slack │ │  Cloud   │    │  DynamoDB (Prod)     │
│Explorer│ │Webhooks          │    │                      │
│Security├─┤      │          │    │  ├─ Costs            │
│Hub     │ │      │          │    │  ├─ Alerts           │
│        │ │      │          │    │  ├─ Users            │
└───────┘ └──────┘ └──────────┘    │  └─ Chat             │
                                    └──────────────────────┘
```

---

## 🔄 Alert & Ticket Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ALERT DETECTION FLOW                         │
└─────────────────────────────────────────────────────────────────┘

DETECTION SOURCES
├─ Cost Explorer API
│  └─ Detects cost spikes (> threshold)
│
├─ Security Hub
│  └─ Detects vulnerabilities
│
├─ CloudWatch
│  └─ Detects performance issues (CPU, Memory)
│
└─ Custom Rules
   └─ Compliance checks

         │
         │ (Alert Triggered)
         ▼
    ┌──────────────┐
    │ Monitoring   │
    │ Service      │
    └──────────────┘
         │
         ├──────────────────────────────────┐
         │                                  │
         ▼                                  ▼
    ┌──────────────────┐           ┌────────────────────┐
    │ Teams Webhook    │           │ Slack Webhook      │
    ├──────────────────┤           ├────────────────────┤
    │ POST webhook URL │           │ POST webhook URL   │
    │ Format: Adaptive │           │ Format: Blocks     │
    │ Cards            │           │                    │
    └──────────────────┘           └────────────────────┘
         │                                │
    [NOTIFICATION SENT]          [NOTIFICATION SENT]
         │                                │
         ▼                                ▼
    ┌──────────────┐             ┌──────────────┐
    │  MS Teams    │             │    Slack     │
    │  # alerts    │             │  # aws-alerts│
    │              │             │              │
    │ 🚨 CRITICAL  │             │ [View] [Close]
    │    Cost Spike│             │              │
    │  Service: EC2│             └──────────────┘
    │   [View]     │
    │   [Snooze]   │
    └──────────────┘
```

---

## 📋 YouTrack Integration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   YOUTRACK INTEGRATION                          │
└─────────────────────────────────────────────────────────────────┘

    Alert Triggered
         │
         ▼
    ┌──────────────────────────────┐
    │ Monitoring Service           │
    │                              │
    │ 1. Format Alert              │
    │ 2. Determine Severity        │
    │ 3. Select Tags               │
    │ 4. Prepare Metadata          │
    └──────────────────────────────┘
         │
         ▼
    ┌──────────────────────────────────────┐
    │ YouTrack Service (NEW)               │
    │                                      │
    │ create_alert_issue(                  │
    │   alert_type: "cost_spike"           │
    │   severity: "CRITICAL"               │
    │   service: "EC2"                     │
    │   message: "Cost up 60%"             │
    │   account_id: "123456789012"         │
    │   metadata: {...}                    │
    │ )                                    │
    └──────────────────────────────────────┘
         │
         ▼
    ┌──────────────────────────────────────┐
    │ YouTrack API                         │
    │                                      │
    │ POST /api/issues                     │
    │ ├─ summary: "[COST_SPIKE] CRITICAL" │
    │ ├─ description: Full details         │
    │ ├─ type: Bug/Task                    │
    │ ├─ priority: Critical/High/Normal    │
    │ ├─ tags: [cost_spike, ec2, ...]     │
    │ └─ custom_fields: {...}              │
    └──────────────────────────────────────┘
         │
         ▼ (Issue Created)
    ┌──────────────────────────────────────┐
    │ YouTrack Dashboard                   │
    │                                      │
    │ MSP-123                              │
    │ [COST_SPIKE] CRITICAL - EC2          │
    │ │                                    │
    │ ├─ Status: Submitted                 │
    │ ├─ Priority: Critical                │
    │ ├─ Service: EC2                      │
    │ ├─ Account: 123456789012             │
    │ ├─ Assigned to: [Unassigned]         │
    │ └─ Tags: cost_spike, critical, ec2   │
    └──────────────────────────────────────┘
         │
         ▼ (Team Actions)
    ├─ Team sees notification
    ├─ Opens YouTrack
    ├─ Reviews issue details
    ├─ Assigns to person
    ├─ Investigates issue
    ├─ Adds comments
    └─ Changes status to Resolved
```

---

## 🚀 CI/CD Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   CI/CD DEPLOYMENT FLOW                         │
└─────────────────────────────────────────────────────────────────┘

Developer Push
    │
    ▼ git push origin main
┌──────────────────────────┐
│ GitHub Repository        │
└──────────────────────────┘
    │
    │ (Webhook)
    ▼
┌──────────────────────────────────────────────┐
│ GitHub Actions Workflow: deploy.yml          │
│                                              │
│ Triggered on: push to main, PR to main       │
└──────────────────────────────────────────────┘
    │
    ├─────────────────────────────────────────┐
    │                                         │
    ▼ (5-10 min)                      ▼ (parallel)
┌──────────────────────┐      ┌──────────────────────┐
│ TESTS STAGE          │      │ TESTS STAGE          │
├──────────────────────┤      ├──────────────────────┤
│ Backend:             │      │ Frontend:            │
│ - pytest             │      │ - npm run lint       │
│ - flake8             │      │ - npm run type-check │
│ - black              │      │ - npm run build      │
│ - mypy               │      │                      │
│                      │      │ Security:            │
│ Expected: ✅ PASS    │      │ - Trivy scan         │
└──────────────────────┘      │                      │
                               │ Expected: ✅ PASS    │
                               └──────────────────────┘
    │                              │
    └──────────────┬───────────────┘
                   │
                   ▼ (Tests must pass to continue)
        ┌──────────────────────┐
        │ BUILD STAGE (10 min) │
        ├──────────────────────┤
        │ 1. Build Docker IMG  │
        │    docker build      │
        │                      │
        │ 2. Push to ECR       │
        │    aws ecr push      │
        │                      │
        │ Tag: SHA or v1.2.3   │
        └──────────────────────┘
                   │
                   ▼ (Image pushed to AWS ECR)
        ┌──────────────────────┐
        │ DEPLOY STAGE (5 min) │
        ├──────────────────────┤
        │ 1. Update ECS        │
        │    new task def      │
        │    updated image     │
        │                      │
        │ 2. Stop old tasks    │
        │    Start new tasks   │
        │    (0 downtime)      │
        │                      │
        │ 3. Deploy Frontend   │
        │    S3 sync build/    │
        │                      │
        │ 4. Invalidate Cache  │
        │    CloudFront        │
        │                      │
        │ 5. Send Notification │
        │    Teams Message     │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ MONITORING           │
        ├──────────────────────┤
        │ - ECS health checks  │
        │ - CloudWatch logs    │
        │ - Deployment status  │
        │ - Auto-rollback      │
        │   if issues          │
        └──────────────────────┘
```

---

## 🏢 Production AWS Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  AWS PRODUCTION DEPLOYMENT                      │
└─────────────────────────────────────────────────────────────────┘

INTERNET
  │
  ▼
┌─────────────────────────────────────────┐
│ Route 53 (DNS)                          │
│ msp-assistant.company.com               │
└─────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ CloudFront CDN (Global Distribution)                        │
├─────────────────────────────────────────────────────────────┤
│ - Cache frontend files                                       │
│ - Compress responses                                         │
│ - Cache HTTPS                                               │
│ - DDoS protection                                            │
└─────────────────────────────────────────────────────────────┘
  │
  ├─────────────────────────────┬─────────────────────────────┐
  │                             │                             │
  ▼ Static Files               ▼ API Requests               ▼
┌─────────────────────────┐  ┌──────────────────────────────┐
│ S3 (Frontend)           │  │ Application Load Balancer    │
│                         │  │ (ALB)                        │
│ - index.html            │  │ - Port 443 (HTTPS)           │
│ - CSS, JS, Images       │  │ - Health checks              │
│ - Versioned builds      │  │ - Auto-scale routes          │
│ - Version control       │  │ - Sticky sessions            │
└─────────────────────────┘  └──────────────────────────────┘
                                    │
                                    ▼
                        ┌────────────────────────┐
                        │ ECS Fargate Cluster    │
                        ├────────────────────────┤
                        │                        │
                        │ Task 1: Backend API    │
                        │ ├─ Container: FastAPI  │
                        │ ├─ 512 CPU             │
                        │ ├─ 1024 MB RAM         │
                        │ └─ Port 8000           │
                        │                        │
                        │ Task 2: Backend API    │
                        │ ├─ Container: FastAPI  │
                        │ ├─ 512 CPU             │
                        │ ├─ 1024 MB RAM         │
                        │ └─ Port 8000           │
                        │                        │
                        │ (Auto-scales 1-4 tasks)
                        └────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
        ┌─────────────────┐  ┌──────────────┐  ┌─────────────┐
        │ DynamoDB Tables │  │ AWS Services │  │ CloudWatch  │
        │                 │  │              │  │             │
        │ - msp-costs     │  │ - Cost       │  │ - Logs      │
        │ - msp-alerts    │  │   Explorer   │  │ - Metrics   │
        │ - msp-users     │  │ - Security   │  │ - Alarms    │
        │ - msp-chat      │  │   Hub        │  │ - Dashboard │
        │                 │  │ - Bedrock    │  │             │
        │ On-demand       │  │ - CloudWatch │  │ Monitoring  │
        │ (Auto-scale)    │  │              │  │             │
        └─────────────────┘  └──────────────┘  └─────────────┘
        
        └─────────────────────────────────────┬───────────────┘
                                              │
                        ┌─────────────────────┴─────────────┐
                        │                                   │
                        ▼                                   ▼
            ┌─────────────────────┐           ┌──────────────────────┐
            │ Notifications       │           │ YouTrack Integration │
            │                     │           │                      │
            │ - Teams Webhook     │           │ - Create tickets     │
            │ - Slack Webhook     │           │ - Update issues      │
            │ - Email (SMTP)      │           │ - Search tickets     │
            │ - SNS (optional)    │           │ - Add comments       │
            └─────────────────────┘           └──────────────────────┘
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                              │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Network Security
├─ VPC with private subnets
├─ Security Groups (ALB & ECS)
├─ NACLs (optional)
└─ SSL/TLS encryption

Layer 2: Application Security
├─ JWT token authentication
├─ Password hashing (bcrypt)
├─ Input validation (Pydantic)
├─ CORS configuration
└─ Rate limiting

Layer 3: API Security
├─ Authorization headers
├─ Timeout protection
├─ Request validation
├─ Error handling
└─ Audit logging

Layer 4: AWS Service Security
├─ IAM roles & policies
├─ Secrets Manager (optional)
├─ CloudTrail logging
├─ VPC Flow Logs
└─ Config Rules

Layer 5: Data Security
├─ DynamoDB encryption
├─ S3 versioning & MFA delete
├─ Backup policies
├─ Data retention rules
└─ GDPR compliance
```

---

## 📊 Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────────┐
│              MONITORING & OBSERVABILITY STACK                   │
└─────────────────────────────────────────────────────────────────┘

DATA SOURCES
│
├─ CloudWatch Metrics
│  ├─ ECS CPU/Memory
│  ├─ ALB response time
│  ├─ DynamoDB read/write
│  └─ Lambda duration
│
├─ CloudWatch Logs
│  ├─ /ecs/msp-assistant (backend)
│  ├─ /aws/s3/msp-assistant (frontend)
│  └─ Application logs
│
├─ CloudTrail
│  └─ AWS API calls
│
└─ Custom Metrics
   ├─ API request count
   ├─ Alert creation rate
   └─ Ticket resolution time
   │
   ▼
┌─────────────────────────────┐
│ CloudWatch Dashboard        │
│                             │
│ - System health             │
│ - Performance metrics       │
│ - Error rates               │
│ - Cost tracking             │
│ - Alert summary             │
└─────────────────────────────┘
   │
   ├─ Alarms → SNS Topic
   │           └─ Teams notification
   │           └─ Slack notification
   │           └─ Email alert
   │
   └─ Logs → Log Insights
            ├─ Query logs
            ├─ Search errors
            └─ Analyze patterns
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   DATA FLOW ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────┘

USER INTERACTIONS
│
├─ Login/Register
│  └─ POST /api/auth/login
│     └─ DynamoDB: msp-users
│        └─ Return JWT Token
│
├─ View Dashboard
│  └─ GET /api/costs/summary
│     └─ DynamoDB: msp-costs
│        └─ Aggregated costs
│
├─ Send Chat Message
│  └─ POST /api/chat/
│     ├─ Save to DynamoDB: msp-chat
│     ├─ Send to Bedrock API
│     ├─ Get AI response
│     └─ Save response
│
├─ View Alerts
│  └─ GET /api/alerts/
│     ├─ DynamoDB: msp-alerts
│     └─ Filter by severity
│
└─ Generate Report
   └─ POST /api/reports/generate
      ├─ Query costs
      ├─ Query alerts
      ├─ Generate PDF
      └─ Store in S3

BACKGROUND PROCESSES

Monitoring Service (24/7)
├─ Check Cost Explorer API
├─ Check Security Hub
├─ Check CloudWatch Metrics
├─ Detect anomalies
├─ Create alerts → DynamoDB
├─ Send webhooks (Teams/Slack/YouTrack)
└─ Store in msp-alerts

Scheduled Tasks (via EventBridge)
├─ Daily: Generate reports
├─ Weekly: Summary email
├─ Monthly: Billing cycle
└─ On-demand: Manual refresh
```

---

## 📱 API Endpoints Map

```
┌──────────────────────────────────────────────────────────────────┐
│                    API ENDPOINT STRUCTURE                        │
└──────────────────────────────────────────────────────────────────┘

/api/auth
├─ POST /login
├─ POST /signup
├─ POST /refresh
├─ POST /logout
└─ GET /me

/api/accounts
├─ GET / (list accounts)
├─ POST / (create account)
├─ GET /{id} (get details)
├─ PUT /{id} (update)
├─ DELETE /{id} (remove)
└─ POST /{id}/test (test connection)

/api/costs
├─ GET / (list costs)
├─ GET /summary (dashboard summary)
├─ GET /trend (30-day trend)
├─ POST /anomalies (detect spikes)
└─ GET /recommendations (get tips)

/api/alerts
├─ GET / (list alerts)
├─ GET /severity/{level} (filter by severity)
├─ GET /{id} (get details)
├─ PUT /{id} (mark as read)
└─ DELETE /{id} (acknowledge)

/api/chat
├─ POST / (send message)
├─ GET /conversations (list)
├─ GET /conversations/{id} (view)
└─ DELETE /conversations/{id}

/api/reports
├─ GET / (list reports)
├─ POST / (generate new)
├─ GET /{id} (view report)
└─ POST /{id}/download

/api/webhooks
├─ GET /config (show configuration)
├─ POST /test (test webhooks)
└─ GET /docs (setup guide)

/api/youtrack  ◄── NEW
├─ GET /config (check setup)
├─ POST /test (test connection)
├─ POST /issues (create ticket)
├─ POST /issues/from-alert (from alert)
├─ GET /issues/{id} (get ticket)
├─ PUT /issues/{id} (update ticket)
├─ POST /issues/{id}/comments (add comment)
├─ POST /search (search tickets)
└─ GET /docs (setup documentation)

/health
└─ GET / (service health check)
```

---

## 🎯 Integration Points

```
┌──────────────────────────────────────────────────────────────────┐
│              EXTERNAL INTEGRATIONS & WEBHOOKS                    │
└──────────────────────────────────────────────────────────────────┘

AWS SERVICES
├─ Cost Explorer
│  └─ GET: Retrieve cost data
│
├─ Security Hub
│  └─ GET: Retrieve security findings
│
├─ CloudWatch
│  └─ GET: Retrieve metrics & logs
│
├─ Bedrock
│  └─ POST: Send messages to Claude AI
│
├─ DynamoDB
│  ├─ PUT: Store data
│  ├─ GET: Retrieve data
│  └─ SCAN: Query data
│
├─ S3
│  ├─ PUT: Upload files
│  ├─ GET: Download files
│  └─ DELETE: Remove files
│
└─ ECR
   └─ PUSH: Upload Docker images

EXTERNAL WEBHOOKS
├─ Microsoft Teams
│  └─ POST: Send notifications with Adaptive Cards
│
├─ Slack
│  └─ POST: Send notifications with Blocks
│
├─ YouTrack
│  ├─ POST: Create/update tickets
│  ├─ GET: Retrieve ticket data
│  └─ PUT: Modify tickets
│
└─ Email (SMTP)
   └─ SEND: Email reports & alerts
```

---

## 🔄 Deployment Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│             DEPLOYMENT PIPELINE ARCHITECTURE                     │
└──────────────────────────────────────────────────────────────────┘

Version Control
│
├─ Branch: main (production)
├─ Branch: develop (staging)
└─ Branch: feature/* (development)
   │
   ▼
GitHub Actions
├─ Test → lint, type check, run tests
├─ Build → docker build, push to ECR
├─ Deploy → update ECS, sync S3
├─ Verify → health checks, smoke tests
└─ Notify → Teams message
   │
   ▼
Artifact Registry (ECR)
├─ Backend images: msp-assistant-backend:v1.2.3
└─ Tags: latest, v1.2.3, sha-abc123
   │
   ▼
ECS Fargate Deployment
├─ Load new task definition
├─ Drain old tasks (graceful shutdown)
├─ Start new tasks (with new image)
├─ Update ALB target groups
└─ Health checks pass
   │
   ▼
Frontend Deployment
├─ Build frontend (npm run build)
├─ Upload to S3
├─ Invalidate CloudFront cache
└─ Users see new version
   │
   ▼
Monitoring & Rollback
├─ CloudWatch metrics
├─ Error rate monitoring
├─ If issues: auto-rollback
└─ Deployment complete
```

---

## 📈 Scaling Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                  AUTO-SCALING ARCHITECTURE                       │
└──────────────────────────────────────────────────────────────────┘

Metrics Monitored
│
├─ CPU Utilization
│  └─ Target: 70%
│     ├─ Above 70% → Scale UP (add tasks)
│     └─ Below 40% → Scale DOWN (remove tasks)
│
├─ Memory Utilization
│  └─ Target: 80%
│     └─ Similar scaling logic
│
└─ Request Count
   └─ Track requests per task
      └─ Auto-scale based on load
   │
   ▼
ECS Auto Scaling Group
├─ Min tasks: 1
├─ Max tasks: 4
├─ Desired: 2-3 (based on load)
│
├─ Scale-UP Rules
│  └─ When CPU > 70% for 2 min
│     └─ Add 1 task
│
├─ Scale-DOWN Rules
│  └─ When CPU < 40% for 5 min
│     └─ Remove 1 task
│
└─ Cool-down Period: 5 minutes
   └─ Prevent rapid scaling
   │
   ▼
Load Balancer (ALB)
├─ Distributes traffic
├─ Health checks (every 30 sec)
├─ Drains connections gracefully
└─ Routes to available tasks
   │
   ▼
Database Scaling
├─ DynamoDB (on-demand)
│  ├─ Auto-scales read capacity
│  ├─ Auto-scales write capacity
│  └─ Pay per request
│
└─ CloudWatch Auto Scaling
   └─ Monitors and adjusts
```

---

This comprehensive architecture documentation covers all aspects of your system from development through production deployment.

