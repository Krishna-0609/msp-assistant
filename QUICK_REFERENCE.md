# MSP Assistant - Quick Reference Guide

## 🚀 Running the Application

### Local Development (Currently Running ✅)
```bash
# Terminal 1: Backend
cd backend
python -m uvicorn app.main:app --reload
# Runs on: http://localhost:8000

# Terminal 2: Frontend  
cd frontend
npm run dev
# Runs on: http://localhost:3001
```

### Demo Login Credentials
```
Email:    admin@example.com
Password: Demo@123
```

### API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **API Root**: http://localhost:8000/

---

## 📋 Key Endpoints

### Authentication
```
POST   /api/auth/login              - User login
POST   /api/auth/signup             - User registration
GET    /api/auth/me                 - Get current user
```

### Costs
```
GET    /api/costs/                  - List costs
GET    /api/costs/summary           - Cost summary
POST   /api/costs/analyze           - Cost recommendations
POST   /api/costs/anomalies         - Detect anomalies
GET    /api/costs/trend             - Historical trends
```

### Alerts
```
GET    /api/alerts/                 - List alerts
GET    /api/alerts/{id}             - Get alert details
PATCH  /api/alerts/{id}             - Mark as read
GET    /api/alerts/severity/critical - Critical alerts
```

### Chat
```
POST   /api/chat/                   - Send message
GET    /api/chat/conversations/{id} - Get conversation
GET    /api/chat/conversations      - List conversations
```

### Webhooks
```
POST   /api/webhooks/test           - Test webhook config
GET    /api/webhooks/config         - Get webhook status
GET    /api/webhooks/docs           - Get setup docs
```

---

## 🔧 Configuration Files

### Backend Configuration
- `.env` - Environment variables
  - AWS credentials and region
  - DynamoDB table names
  - Bedrock model ID
  - Teams/Slack webhook URLs
  - CORS origins

### Frontend Configuration
- `.env` - API endpoints
  - `VITE_API_URL=http://localhost:8000/api`
  - `VITE_WS_URL=ws://localhost:8000/ws` (websocket)

---

## 📁 Project Structure

```
├── backend/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── services/         # AWS integration
│   │   ├── core/             # Config, security, logging
│   │   └── schemas/          # Data models
│   ├── Dockerfile            # Container config
│   ├── requirements.txt       # Python dependencies
│   └── .env                  # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── pages/            # React pages
│   │   ├── components/       # React components
│   │   ├── services/         # API clients
│   │   ├── types/            # TypeScript types
│   │   └── App.tsx           # Main app
│   ├── package.json          # Node dependencies
│   ├── vite.config.ts        # Vite config
│   └── .env                  # Frontend config
│
├── deployment/
│   ├── terraform/            # Infrastructure as Code
│   │   ├── main.tf           # Main config
│   │   └── variables.tf      # Variables
│   ├── docker-compose-prod.yml
│   └── ecs-task-definition.json
│
├── .github/
│   └── workflows/            # CI/CD pipelines
│       ├── deploy.yml        # Deployment workflow
│       └── tests.yml         # Testing workflow
│
└── [Documentation files]
```

---

## 🎯 Common Development Tasks

### Install Dependencies
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Run Tests
```bash
# Backend
cd backend
pytest tests/

# Frontend (if configured)
cd frontend
npm test
```

### Format Code
```bash
# Backend
cd backend
black app/
flake8 app/

# Frontend
cd frontend
npx prettier --write src/
```

### Build for Production
```bash
# Frontend
cd frontend
npm run build
# Output: dist/

# Backend
cd backend
docker build -t msp-assistant-backend:latest .
```

---

## 🔐 AWS Configuration

### One-Time Setup
```bash
# Configure AWS credentials
aws configure --profile default
# Enter: Access Key ID, Secret Access Key, Region (us-east-1)

# Verify connection
aws sts get-caller-identity
```

### Environment Variables
```bash
# In backend/.env
AWS_REGION=us-east-1
AWS_PROFILE=default

# Or use direct credentials:
# AWS_ACCESS_KEY_ID=your-key
# AWS_SECRET_ACCESS_KEY=your-secret
```

---

## 📧 Teams Webhook Setup

### Quick Setup
1. In Microsoft Teams, open your channel
2. Click **⋯ (More options)** → **Connectors**
3. Search for **Incoming Webhook** and click **Configure**
4. Name it `MSP Assistant Alerts`
5. Copy the webhook URL
6. Add to `.env`:
   ```
   TEAMS_WEBHOOK_URL=https://outlook.webhook.office.com/webhookb2/...
   ```

### Test Webhook
```bash
# Test current webhook configuration
curl -X POST http://localhost:8000/api/webhooks/test

# Get webhook status
curl http://localhost:8000/api/webhooks/config
```

---

## 📊 Database Schema

### DynamoDB Tables

**msp-costs**
- Partition Key: `account_id`
- Sort Key: `date`
- Attributes: service, amount, region, trend

**msp-alerts**
- Partition Key: `alert_id`
- Sort Key: `timestamp`
- Attributes: type, severity, message, metadata

**msp-users**
- Partition Key: `user_id`
- Attributes: email, name, role, is_active

**msp-chat**
- Partition Key: `conversation_id`
- Sort Key: `timestamp`
- Attributes: user_id, message, response

---

## 🚀 Deployment Checklist

### Before Deploying to Production
- [ ] All tests passing
- [ ] AWS credentials configured
- [ ] Teams webhook URL set
- [ ] Environment variables reviewed
- [ ] Docker image built and tested
- [ ] Terraform validated
- [ ] GitHub secrets configured
- [ ] Custom domain ready (optional)

### Deploy to Production
```bash
# 1. Push to main branch
git push origin main

# 2. GitHub Actions automatically:
#    - Runs tests
#    - Builds Docker image
#    - Pushes to ECR
#    - Deploys to ECS
#    - Deploys frontend to S3
#    - Invalidates CloudFront

# 3. Monitor deployment
gh run list --repo YOUR_ORG/msp-assistant
```

---

## 📈 Monitoring Commands

### View Backend Logs
```bash
# Local development
tail -f logs/app.log

# Production (after deployment)
aws logs tail /ecs/msp-assistant-backend --follow
```

### Check Service Health
```bash
# Backend health
curl http://localhost:8000/health

# Production ECS service
aws ecs describe-services \
  --cluster msp-assistant-cluster \
  --services msp-assistant-backend-service
```

### View Metrics
```bash
# Get ECS CPU utilization (last hour)
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name CPUUtilization \
  --dimensions Name=ServiceName,Value=msp-assistant-backend-service \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average
```

---

## 🆘 Troubleshooting

### Backend Won't Start
```bash
# Check Python version
python --version  # Should be 3.11+

# Check dependencies
pip list | grep -E "fastapi|uvicorn"

# Check port
lsof -i :8000

# Try verbose mode
python -m uvicorn app.main:app --reload --log-level debug
```

### Frontend Won't Build
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+

# Try verbose build
npm run build -- --debug
```

### Webhook Not Working
```bash
# Test webhook
curl -X POST http://localhost:8000/api/webhooks/test

# Check webhook URL format
# Should start with: https://outlook.webhook.office.com/webhookb2/

# Verify backend can reach Teams
curl -I https://outlook.webhook.office.com
```

### Can't Connect to AWS
```bash
# Check AWS credentials
aws sts get-caller-identity

# Check AWS profile
aws configure list --profile default

# Verify region
export AWS_REGION=us-east-1
```

---

## 📞 Useful Commands

### Git
```bash
# Check status
git status

# Create feature branch
git checkout -b feature/my-feature

# Commit changes
git commit -am "feat: add new feature"

# Push to GitHub
git push origin feature/my-feature
```

### Docker
```bash
# Build image
docker build -t msp-assistant-backend:latest -f backend/Dockerfile .

# Run container
docker run -p 8000:8000 msp-assistant-backend:latest

# View images
docker images
```

### AWS CLI
```bash
# List EC2 instances
aws ec2 describe-instances

# List S3 buckets
aws s3 ls

# List DynamoDB tables
aws dynamodb list-tables

# Get CloudFront distributions
aws cloudfront list-distributions
```

---

## 📚 Documentation Links

### Internal Guides
- `COMPLETE_IMPLEMENTATION.md` - Full feature summary
- `DEPLOYMENT_GUIDE.md` - Production deployment guide
- `TEAMS_SETUP_GUIDE.md` - Teams webhook setup
- `README_START_HERE.md` - Getting started guide

### External Resources
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [AWS SDK for Python](https://boto3.amazonaws.com/)
- [Terraform Docs](https://www.terraform.io/docs/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

## 💾 Backup & Recovery

### Backup Commands
```bash
# Backup DynamoDB table
aws dynamodb create-backup \
  --table-name msp-costs \
  --backup-name msp-costs-backup-$(date +%s)

# Export DynamoDB to S3
aws dynamodb export-table-to-point-in-time \
  --table-arn arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/msp-costs \
  --s3-bucket my-backups-bucket \
  --s3-prefix "backups/"
```

### Restore Commands
```bash
# Restore DynamoDB from backup
aws dynamodb restore-table-from-backup \
  --target-table-name msp-costs-restored \
  --backup-arn arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/msp-costs/backup/...
```

---

## 🎓 Learning Resources

### For Beginners
1. Start with local development
2. Read COMPLETE_IMPLEMENTATION.md
3. Play with mock data in dashboard
4. Test webhook integration

### For DevOps
1. Review Terraform configuration
2. Study GitHub Actions workflows
3. Learn ECS task definitions
4. Understand CloudFront caching

### For Backend Developers
1. Review FastAPI structure
2. Learn about AWS service integrations
3. Understand DynamoDB queries
4. Study monitoring service

### For Frontend Developers
1. Review React component structure
2. Learn Tailwind CSS usage
3. Understand API client pattern
4. Study state management

---

**Last Updated**: May 14, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
