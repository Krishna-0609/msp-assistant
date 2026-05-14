# MSP Assistant - Complete Implementation Plan

## Executive Summary
Build a production-ready AWS Cost Intelligence platform with AI-powered analysis, real-time monitoring, and automated reporting. Focus on cost optimization through serverless architecture, efficient data processing, and intelligent caching.

---

## PHASE 1: Architecture & Infrastructure (Week 1-2)

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (SPA)                           │
│  React + TypeScript + Tailwind CSS (CloudFront + S3)            │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────────────┐
│              API Gateway + ALB (Layer 7)                         │
│  - Rate limiting (1000 req/min per user)                         │
│  - Request validation                                             │
│  - CORS handling                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
┌───▼──────┐  ┌──────────▼────────┐  ┌──────▼──────────┐
│  Lambda  │  │  ECS Fargate      │  │  Lambda         │
│  Async   │  │  (Bedrock Agent)  │  │  (Cache Mgmt)   │
│  Tasks   │  │  (Cost Analysis)  │  │                 │
└────┬─────┘  └─────────┬─────────┘  └────────┬────────┘
     │                  │                     │
     └──────────────────┼─────────────────────┘
                        │
    ┌───────────────────┼───────────────────┐
    │                   │                   │
┌───▼────────┐  ┌──────▼─────┐  ┌─────────▼────┐
│  DynamoDB  │  │  RDS/Aurora│  │  S3 (reports)│
│ (On-demand)│  │  (Optional)│  │              │
└────────────┘  └────────────┘  └────────┬─────┘
                                         │
                    ┌────────────────────┘
                    │
            ┌───────▼──────────┐
            │ CloudWatch Logs  │
            │ X-Ray Tracing    │
            └──────────────────┘
```

### 1.2 AWS Services & Cost Optimization

| Service | Usage | Cost Optimization |
|---------|-------|-------------------|
| **CloudFront** | CDN for frontend | Cache TTL: 86400s (1 day), Compress assets |
| **S3** | Frontend hosting + reports | Versioning disabled, Auto-delete old reports (30 days) |
| **Lambda** | Async tasks, scheduled jobs | Memory: 256MB (cost optimized), Timeout: 60s |
| **ECS Fargate** | Bedrock agent calls | Task size: 256 CPU, 512 RAM, Auto-scale min=1, max=5 |
| **DynamoDB** | Chat, cache, alerts | On-demand billing (pay-per-request), TTL enabled |
| **RDS/Aurora** | Optional (billing history) | Serverless v2 (pay-per-second), Min ACU: 0.5 |
| **Cognito** | Auth & user management | 50,000 free active users/month |
| **Cost Explorer API** | Cost data | Free tier included |
| **Bedrock** | LLM inference | Use Claude 3.5 Sonnet (cost-effective), Batch API |
| **CloudWatch** | Monitoring | Logs: $0.50/GB, Alarms: $0.10 each |

### 1.3 Cost Estimation (Monthly)

```
Frontend & CDN:
  - CloudFront: $100-200 (based on traffic)
  - S3: $20/month
  - DynamoDB: $100-300 (on-demand)

Compute:
  - Lambda: $50-100
  - ECS Fargate: $30-80 (2.5M vCPU-seconds avg)
  - Bedrock: $200-500 (depends on usage)

Storage:
  - S3 (reports): $5-10
  - DynamoDB storage: $50-100

Monitoring:
  - CloudWatch Logs: $50-100
  - CloudWatch Alarms: $5-10
  - X-Ray: $20-50

Total Baseline: $600-1,250/month
Savings via optimization: 20-30% reduction possible
```

---

## PHASE 2: Backend Architecture (Week 2-3)

### 2.1 Directory Structure

```
msp-assistant/
├── backend/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI app
│   │   ├── middleware.py           # Auth, logging, tracing
│   │   ├── routes/
│   │   │   ├── auth.py            # Login, logout, refresh
│   │   │   ├── chat.py            # Chat endpoints
│   │   │   ├── costs.py           # Cost analysis endpoints
│   │   │   ├── reports.py         # Report generation
│   │   │   ├── admin.py           # Admin functions
│   │   │   └── health.py          # Health checks
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── chat.py
│   │   │   ├── costs.py
│   │   │   └── reports.py
│   │   └── dependencies.py         # DI containers
│   ├── agents/
│   │   ├── supervisor.py          # Route queries to specialists
│   │   ├── cost_specialist.py     # Cost analysis agent
│   │   ├── optimization_specialist.py
│   │   ├── billing_specialist.py
│   │   ├── performance_specialist.py
│   │   └── security_specialist.py
│   ├── services/
│   │   ├── cost_explorer.py       # AWS Cost Explorer API
│   │   ├── bedrock.py             # Bedrock integration
│   │   ├── anomaly_detection.py   # ML anomaly detection
│   │   ├── forecasting.py         # Cost forecasting
│   │   ├── cache.py               # DynamoDB caching
│   │   ├── auth_service.py        # Cognito integration
│   │   ├── notifications.py       # Teams, Slack, Email
│   │   └── reporting.py           # Excel/PDF generation
│   ├── models/
│   │   ├── dynamodb.py            # DynamoDB models
│   │   └── schemas.py
│   ├── utils/
│   │   ├── logger.py              # Structured logging
│   │   ├── constants.py
│   │   ├── validators.py
│   │   └── formatters.py
│   ├── lambda_functions/
│   │   ├── cache_updater.py       # 6-hourly cache refresh
│   │   ├── anomaly_detector.py    # Hourly anomaly check
│   │   ├── report_generator.py    # Monthly report
│   │   └── alert_escalation.py    # Alert escalation
│   ├── requirements.txt
│   ├── Dockerfile
│   └── pytest.ini
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── infrastructure/
│   ├── terraform/
│   │   ├── main.tf               # Main infrastructure
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   ├── cognito.tf            # Auth
│   │   ├── dynamodb.tf           # Database
│   │   ├── lambda.tf             # Serverless functions
│   │   ├── ecs.tf                # Container orchestration
│   │   ├── api_gateway.tf        # API Gateway
│   │   ├── cloudfront.tf         # CDN
│   │   ├── s3.tf                 # Storage
│   │   ├── iam.tf                # Permissions
│   │   ├── cloudwatch.tf         # Monitoring
│   │   ├── secrets.tf            # Secrets Manager
│   │   └── vpc.tf                # Networking
│   └── docker-compose.yml        # Local dev environment
├── scripts/
│   ├── deploy.sh
│   ├── test.sh
│   ├── local-dev.sh
│   └── populate-test-data.py
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .github/
│   └── workflows/
│       ├── build.yml             # Build & test
│       ├── deploy-staging.yml    # Deploy to staging
│       └── deploy-prod.yml       # Deploy to production
├── docker-compose.yml            # Local dev
├── .env.example
├── .gitignore
├── README.md
└── DEPLOYMENT.md
```

### 2.2 Backend Technologies

| Component | Technology | Reason |
|-----------|-----------|--------|
| Framework | FastAPI | High performance, async-first, auto OpenAPI docs |
| Database | DynamoDB + optional Aurora Serverless | Serverless, pay-per-request, high availability |
| Auth | AWS Cognito | Managed service, MFA support, compliance-ready |
| LLM | AWS Bedrock | Managed service, multiple models, no infrastructure |
| Async Tasks | AWS Lambda + SQS | Serverless, auto-scaling, cost-efficient |
| Caching | DynamoDB TTL + Redis | TTL for auto-cleanup, Redis optional for speed |
| Logging | CloudWatch | Native AWS, structured logs, searchable |
| Testing | pytest | Standard Python testing, async support |

### 2.3 Key Backend Services

#### Cost Explorer Service
```python
# backend/services/cost_explorer.py
class CostExplorerService:
    - get_daily_costs(date_range) → cached results
    - get_service_breakdown(date_range) → service-level detail
    - get_cost_anomalies(baseline_days=90) → ML-detected spikes
    - forecast_costs(days=30) → ARIMA prediction
    - get_comparison(period1, period2) → MoM/YoY analysis
```

#### Bedrock Agent Service
```python
# backend/services/bedrock.py
class BedrockService:
    - invoke_supervisor_agent(query, user_context)
    - invoke_cost_specialist(query)
    - invoke_optimization_specialist(analysis)
    - invoke_billing_specialist(historical_data)
    - invoke_security_specialist(findings)
    - calculate_confidence_score(model_response, data_freshness)
```

#### Anomaly Detection Service
```python
# backend/services/anomaly_detection.py
class AnomalyDetectionService:
    - calculate_baseline(historical_data) → mean, std_dev
    - detect_anomalies(current_costs, baseline) → list[Anomaly]
    - analyze_root_cause(spike_service, spike_amount)
    - escalate_alert(severity, cause) → Teams/Slack/SMS
    - auto_resolve_alerts(threshold_time_hours=2)
```

---

## PHASE 3: Frontend Architecture (Week 3-4)

### 3.1 Frontend Stack

```
React 18.2 + TypeScript + Vite
├── UI Framework: Tailwind CSS + Headless UI
├── State Management: React Query + Zustand
├── Charts: Recharts (optimized for performance)
├── Auth: @aws-amplify/auth
├── Real-time: Socket.io
├── Forms: React Hook Form + Zod
└── Build: Vite (3x faster than CRA)
```

### 3.2 Key Pages & Components

```
Pages:
├── /login                  # Cognito auth
├── /dashboard              # Main dashboard
├── /chat                   # AI chat interface
├── /costs                  # Cost analysis
├── /reports                # Report generation
├── /admin                  # Admin panel
└── /health                 # System health (public)

Components:
├── Dashboard
│   ├── CostCard           # Total costs + trend
│   ├── Heatmap            # 90-day visualization
│   ├── ServiceBreakdown   # Pie chart by service
│   ├── TrendChart         # Line chart with forecast
│   └── AlertWidget        # Recent alerts
├── Chat
│   ├── ConversationList   # Previous chats
│   ├── MessageThread      # Current conversation
│   ├── MessageInput       # User input
│   └── ConfidenceBar      # Animated confidence
├── Reports
│   ├── ReportBuilder      # Custom report UI
│   ├── ReportPreview      # Report preview
│   └── ExportOptions      # Download formats
└── Admin
    ├── UserManager        # CRUD users
    ├── AlertConfig        # Alert settings
    └── HealthDashboard    # System metrics
```

### 3.3 Performance Optimization

```
Frontend Optimizations:
1. Code Splitting
   - Route-based code splitting via React.lazy()
   - Reduce initial bundle: <200KB gzipped

2. Image Optimization
   - WebP format with PNG fallback
   - Responsive images with srcset
   - Lazy loading for below-fold content

3. Caching Strategy
   - localStorage: User preferences, chat history (24h)
   - Service Worker: Static assets (long cache)
   - React Query: API responses (5min TTL)

4. Bundle Size
   - Remove unused dependencies
   - Dynamic imports for heavy libraries
   - Tree-shaking enabled by default in Vite

5. Network Optimization
   - Gzip compression (text assets)
   - Brotli compression (modern browsers)
   - HTTP/2 Server Push for critical resources
   - DNS prefetch for external APIs
```

---

## PHASE 4: CI/CD Pipeline (Week 2-5, Parallel)

### 4.1 GitHub Actions Workflow

#### File: `.github/workflows/build.yml`
```yaml
name: Build & Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x]
        python-version: [3.11]

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}
          cache: 'pip'
      
      # Frontend Tests
      - name: Install frontend dependencies
        run: cd frontend && npm ci
      
      - name: Frontend lint
        run: cd frontend && npm run lint
      
      - name: Frontend type check
        run: cd frontend && npm run type-check
      
      - name: Frontend unit tests
        run: cd frontend && npm run test:unit
      
      # Backend Tests
      - name: Install backend dependencies
        run: cd backend && pip install -r requirements.txt
      
      - name: Backend lint (flake8)
        run: cd backend && flake8 . --max-line-length=120
      
      - name: Backend type check (mypy)
        run: cd backend && mypy api services
      
      - name: Backend unit tests
        run: cd backend && pytest tests/unit -v --cov
      
      - name: Backend integration tests
        run: cd backend && pytest tests/integration -v
      
      # Security scanning
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload SARIF to GitHub
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
      
      # Build artifacts
      - name: Build frontend
        run: cd frontend && npm run build
      
      - name: Build backend Docker image
        run: cd backend && docker build -t msp-assistant:${{ github.sha }} .
      
      - name: Upload coverage to CodeCov
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage.xml
```

#### File: `.github/workflows/deploy-staging.yml`
```yaml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: staging
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/github-actions
          aws-region: us-east-1
      
      - name: Login to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: msp-assistant-backend
          IMAGE_TAG: staging-${{ github.sha }}
        run: |
          cd backend
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
      
      - name: Deploy frontend to S3
        run: |
          cd frontend
          npm ci
          npm run build
          aws s3 sync dist/ s3://${{ secrets.STAGING_S3_BUCKET }} --delete
      
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.STAGING_CF_DIST_ID }} \
            --paths "/*"
      
      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster msp-assistant-staging \
            --service api-backend \
            --force-new-deployment
      
      - name: Run smoke tests
        run: |
          ./scripts/smoke-tests.sh ${{ secrets.STAGING_URL }}
      
      - name: Slack notification
        if: always()
        uses: slackapi/slack-github-action@v1.24.0
        with:
          payload: |
            {
              "text": "Staging deployment: ${{ job.status }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Staging Deployment* - ${{ job.status }}\nCommit: ${{ github.sha }}"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

#### File: `.github/workflows/deploy-prod.yml`
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/github-actions
          aws-region: us-east-1
      
      - name: Create deployment
        uses: actions/github-script@v6
        with:
          script: |
            const deployment = await github.rest.repos.createDeployment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              ref: context.sha,
              environment: 'production',
              required_contexts: [],
              auto_merge: false
            });
      
      - name: Login to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: msp-assistant-backend
          IMAGE_TAG: prod-${{ github.sha }}
        run: |
          cd backend
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG \
                     $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
      
      - name: Deploy frontend to S3
        run: |
          cd frontend
          npm ci
          npm run build:prod
          aws s3 sync dist/ s3://${{ secrets.PROD_S3_BUCKET }} --delete
      
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.PROD_CF_DIST_ID }} \
            --paths "/*"
      
      - name: Blue-Green deployment
        run: |
          ./scripts/blue-green-deploy.sh \
            --cluster msp-assistant-prod \
            --service api-backend \
            --image $ECR_REGISTRY/$ECR_REPOSITORY:prod-${{ github.sha }}
      
      - name: Run full test suite
        run: |
          ./scripts/full-test-suite.sh ${{ secrets.PROD_URL }}
      
      - name: Create GitHub release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.run_number }}
          release_name: Release ${{ github.run_number }}
          draft: false
          prerelease: false
```

### 4.2 Deployment Strategy

```
Development Workflow:
┌─────────────────┐
│  Feature Branch │
│    feature/*    │
└────────┬────────┘
         │
         ▼
    ┌─────────┐
    │Build &  │
    │Test    │
    └────┬────┘
         │
         ▼
    ┌─────────┐
    │  PR     │
    │Review   │
    └────┬────┘
         │
         ▼
    ┌─────────────┐
    │Merge to     │
    │develop      │
    └────┬────────┘
         │
         ▼
    ┌──────────────┐
    │Deploy to     │
    │Staging (1h)  │
    └────┬─────────┘
         │
         ▼
    ┌──────────────┐
    │Smoke Tests   │
    │(automated)   │
    └────┬─────────┘
         │ (if pass)
         ▼
    ┌──────────────┐
    │Manual QA     │
    │Testing (4h)  │
    └────┬─────────┘
         │ (if approved)
         ▼
    ┌──────────────┐
    │Merge to main │
    │via PR        │
    └────┬─────────┘
         │
         ▼
    ┌──────────────┐
    │Blue-Green    │
    │Deploy to     │
    │Production    │
    └────┬─────────┘
         │
         ▼
    ┌──────────────┐
    │Smoke Tests   │
    │(automated)   │
    └────┬─────────┘
         │ (if fail)
         ▼
    ┌──────────────┐
    │Auto-Rollback │
    │(< 2 min)     │
    └──────────────┘
```

---

## PHASE 5: Cost Optimization Strategies

### 5.1 Compute Cost Optimization

**Lambda:**
```
Current: 256MB memory, 5-sec execution
Optimization:
- Profile functions to find minimum viable memory
- Use Lambda layers for shared code (reduce package size)
- Enable code golfing: 50MB → 15MB (70% reduction)
- Estimated savings: 30-40%
```

**ECS:**
```
Current: t3.medium (1 GB, 0.5 vCPU) × 2 tasks
Optimization:
- Auto-scale min=1, max=5 (instead of fixed 2)
- Use Fargate Spot (70% cheaper, non-critical tasks)
- Right-size to 256 CPU / 512 RAM
- Estimated savings: 50-60%
```

**DynamoDB:**
```
Current: On-demand (pay-per-request)
Optimization:
- Implement intelligent TTL (auto-delete old data)
- Batch writes (reduces unit consumption by 50%)
- Use sparse attributes (exclude nulls)
- Consider on-demand for unpredictable, provisioned for steady-state
- Estimated savings: 20-30%
```

### 5.2 Storage Cost Optimization

**S3:**
```
Current: Standard storage for all
Optimization:
- Intelligent-Tiering for reports (auto → Glacier after 90 days)
- S3 Select for queries (reduce data transfer)
- Gzip all text objects (50-70% compression)
- Enable versioning only on critical buckets
- Estimated savings: 40-50%
```

**CloudWatch Logs:**
```
Current: 30-day retention for all logs
Optimization:
- Reduce retention: 7 days for debug logs, 30 days for errors
- Filter logs at source (don't log non-errors)
- Use CloudWatch Insights instead of streaming
- Archive to S3 for compliance
- Estimated savings: 70-80%
```

### 5.3 Network Cost Optimization

**Data Transfer:**
```
Current: All cross-region data transfer at full cost
Optimization:
- Compress API responses (gzip all JSON)
- Paginate large API responses (100 items max)
- Use VPC endpoints for AWS service access (free)
- Cache cost data in DynamoDB (avoid repeated calls)
- Estimated savings: 50-70%
```

**CloudFront:**
```
Current: Standard pricing
Optimization:
- Cache aggressively: 86400s for /assets/
- Use cache headers wisely
- Enable Brotli compression
- Regional edge caches for non-US regions
- Estimated savings: 20-30%
```

### 5.4 Database Cost Optimization

**DynamoDB:**
```
✓ Batch writes (25 items per batch)
✓ Use projection expressions (exclude large attributes)
✓ TTL for auto-deletion (old chat data)
✓ Point-in-time recovery disabled for non-critical tables
✓ Global secondary indexes only when necessary
Estimated savings: 25-35%
```

**RDS/Aurora (if used):**
```
✓ Serverless v2 (scale to 0.5 ACU, pay per second)
✓ Read replicas only for critical queries
✓ Delete snapshots after 7 days
✓ Disable Multi-AZ for non-production
Estimated savings: 40-50%
```

### 5.5 AI/ML Cost Optimization

**Bedrock:**
```
Current: On-demand Sonnet model calls
Optimization:
- Batch API for non-real-time requests (50% discount)
- Cache model responses (same query → use cache)
- Prompt optimization (fewer tokens = lower cost)
- Use Claude 3.5 Haiku for simple queries (40% cheaper)
- Token budgeting: max_tokens=500 for most responses
Estimated savings: 30-40%
```

### 5.6 Monitoring Cost Optimization

**CloudWatch:**
```
Current: All metrics, all logs, 30-day retention
Optimization:
- Disable X-Ray sampling for low-traffic services (90%+ sampling)
- Delete unused dashboards and alarms
- Use metric filters instead of logs for analytics
- CloudWatch Insights queries instead of continuous streaming
Estimated savings: 60-70%
```

---

## PHASE 6: Security & Compliance

### 6.1 Authentication & Authorization

```yaml
Authentication Flow:
  1. User login via Cognito (AWS native)
  2. JWT token issued (1 hour access, 30 days refresh)
  3. Frontend stores in secure httpOnly cookie
  4. API validates token via API Gateway authorizer
  5. Token cached for 15 minutes (reduce Cognito calls)

Authorization:
  - Role-based access control (RBAC)
  - Roles: Admin, Analyst, Viewer
  - Permissions stored in DynamoDB
  - Enforced at API Gateway + application level
```

### 6.2 Data Security

```
In Transit:
  ✓ HTTPS/TLS 1.3 everywhere
  ✓ API Gateway encryption
  ✓ DynamoDB encryption at transit

At Rest:
  ✓ DynamoDB encryption (AWS managed keys)
  ✓ S3 encryption (SSE-S3)
  ✓ Secrets Manager for API keys (auto-rotation 30 days)
  ✓ RDS encryption enabled

In Code:
  ✓ No hardcoded secrets
  ✓ Environment variables for config
  ✓ IAM roles for cross-service auth
```

### 6.3 Compliance

```
Standards:
  ✓ SOC 2 Type II ready
  ✓ HIPAA compatible (if needed)
  ✓ GDPR compliant (user data deletion)
  ✓ Data residency: US-East-1

Audit Trail:
  ✓ All API calls logged (CloudWatch)
  ✓ Admin actions logged (DynamoDB)
  ✓ User access logged (Cognito)
  ✓ Data access logged (CloudTrail)
```

---

## PHASE 7: Monitoring & Observability

### 7.1 Metrics

```
Application Metrics:
  - API latency (p50, p95, p99)
  - Error rate (4xx, 5xx)
  - Chat response time
  - Cost data staleness
  - Confidence score distribution
  - Active users (last 24h)

Infrastructure Metrics:
  - Lambda duration & cold starts
  - ECS CPU/Memory utilization
  - DynamoDB consumed capacity
  - CloudFront cache hit ratio
  - S3 request count
  - Bedrock API latency
```

### 7.2 Logging

```
Structured Logs:
  {
    "timestamp": "2026-05-14T10:30:00Z",
    "level": "INFO",
    "service": "api",
    "user_id": "usr-123",
    "request_id": "req-456",
    "action": "chat.message",
    "duration_ms": 245,
    "status": "success"
  }

Log Levels:
  - DEBUG: Non-production only
  - INFO: Key events (user login, API calls)
  - WARNING: Recoverable issues
  - ERROR: Unrecoverable errors
  - CRITICAL: System down
```

### 7.3 Alerting

```
Alert Rules:
  - API error rate > 5% for 5 min → page on-call
  - API latency p99 > 1s for 10 min → alert
  - Lambda cold starts > 20% → investigate
  - DynamoDB throttling → scale up
  - Cost spike > 50% → notify finance team
  - Bedrock API errors > 10% → investigate
```

---

## PHASE 8: Testing Strategy

### 8.1 Test Pyramid

```
          /\
         /  \  E2E Tests (5%)
        /    \  - Full user workflows
       /      \ - Selenium/Playwright
      /        \
     /          \
    /____________\
   /              \  Integration Tests (15%)
  /                \ - API endpoints
 /                  \ - Database operations
/____________________\ - External API mocking
    /              \   Unit Tests (80%)
   /                \ - Functions
  /                  \ - Services
 /____________________\ - Utilities
```

### 8.2 Test Coverage

```python
# Backend targets
- Services: 85%+ coverage
- Utils: 90%+ coverage
- Routes: 70%+ coverage
- Models: 95%+ coverage

# Frontend targets
- Components: 70%+ coverage
- Hooks: 80%+ coverage
- Utils: 90%+ coverage
```

### 8.3 Example Tests

```python
# Backend: Unit Test
def test_anomaly_detection_identifies_spike():
    baseline = 100
    current = 150  # 50% spike
    result = detect_anomaly(baseline, current, threshold=0.4)
    assert result.severity == "high"
    assert result.percentage_increase == 50

# Backend: Integration Test
@pytest.mark.asyncio
async def test_cost_breakdown_api_with_cache():
    # First call: queries AWS Cost Explorer
    response1 = await client.get("/api/v1/services/breakdown")
    assert response1.status_code == 200
    assert "services" in response1.json()
    
    # Second call: uses cache
    response2 = await client.get("/api/v1/services/breakdown")
    assert response2.status_code == 200
    assert response1.json() == response2.json()

# Frontend: Component Test
function render_cost_card_with_positive_trend() {
  const props = { cost: 12543.67, trend: 8.3 };
  render(<CostCard {...props} />);
  
  expect(screen.getByText("$12,543.67")).toBeInTheDocument();
  expect(screen.getByText("↑ 8.3%")).toHaveClass("text-red-500");
}
```

---

## Deployment Checklist

### Pre-Production
- [ ] All tests passing (unit, integration, e2e)
- [ ] Code review approved (2+ reviewers)
- [ ] Security scanning passed (no critical vulnerabilities)
- [ ] Performance benchmarks met (API <500ms p99)
- [ ] Cost estimates validated
- [ ] Documentation complete

### Production Release
- [ ] Database backups created
- [ ] Rollback plan documented
- [ ] Team notified of deployment window
- [ ] On-call engineer available
- [ ] Monitoring dashboards configured
- [ ] Smoke tests automated

### Post-Deployment
- [ ] All health checks passing
- [ ] No error spikes
- [ ] Users confirmed access
- [ ] Metrics trending normal
- [ ] Cost within budget
- [ ] Incident response procedures activated

---

## Success Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| API Availability | 99.9% | - | - |
| API Latency (p99) | <500ms | - | - |
| Chat Response Time | <2s | - | - |
| Monthly Cost | <$1,000 | - | - |
| Test Coverage | >80% | - | - |
| Security Scans | 0 critical | - | - |
| User Adoption | >80% | - | - |
| Cost Reduction (users) | 20-30% | - | - |

---

## Timeline

```
Week 1-2: Architecture & Infrastructure Setup
Week 2-3: Backend Development (API, Services, Agents)
Week 3-4: Frontend Development (Components, Pages, State)
Week 2-5: CI/CD Pipeline (parallel)
Week 5-6: Integration & Testing
Week 6-7: Security Hardening & Compliance
Week 7-8: Performance Optimization & Cost Review
Week 8-9: Staging Deployment & QA
Week 9-10: Production Release
```

---

## Cost Optimization Checklist

- [ ] Lambda memory profiled and optimized
- [ ] ECS auto-scaling configured (min/max)
- [ ] DynamoDB TTL enabled on all tables
- [ ] CloudWatch log retention reduced
- [ ] S3 Intelligent-Tiering enabled
- [ ] CloudFront cache configured aggressively
- [ ] Bedrock batch API used for non-real-time
- [ ] Unused AWS resources cleaned up
- [ ] Reserved Capacity considered for prod
- [ ] Cost anomalies monitored weekly

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-14  
**Status:** Ready for Development
