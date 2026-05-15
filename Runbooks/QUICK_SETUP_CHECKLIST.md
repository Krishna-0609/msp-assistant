# Quick Setup Checklist - YouTrack + CI/CD

## ⚡ 60-Second Overview

**What You Just Got:**
- ✅ YouTrack integration (automatic ticket creation from alerts)
- ✅ CI/CD pipeline (GitHub Actions → ECS Fargate)
- ✅ Complete documentation (5 detailed guides)

**Setup Time:**
- YouTrack: 20 minutes
- CI/CD: 30 minutes
- Total: ~50 minutes

**Files Added:**
- Backend: `app/services/youtrack_service.py` + `app/api/youtrack.py`
- Documentation: 4 new guides + architecture diagrams
- Config: Updated `.env`

---

## 📋 YOUTRACK SETUP (20 MINUTES)

### Phase 1: Get Instance (5 min)
```bash
# Option 1: Cloud (Easiest)
□ Go to https://www.jetbrains.com/youtrack/
□ Click "Get Started" → Cloud
□ Sign in / Create account
□ Create instance: "msp-assistant"
□ Wait ~2 minutes
□ Access: https://your-instance.youtrack.cloud

# Option 2: Docker (Local)
□ docker run -d -p 8080:8080 --name youtrack jetbrains/youtrack:latest
□ Access: http://localhost:8080
```

### Phase 2: Create API Token (5 min)
```bash
□ Login to YouTrack
□ Click profile icon → Settings
□ Click "API tokens"
□ Click "New token"
□ Name: "msp-assistant-integration"
□ Permissions: Check all (Read, Write, Create issues)
□ COPY TOKEN (save somewhere safe)
```

### Phase 3: Create Project (5 min)
```bash
□ Click "New Project"
□ Name: "MSP Assistant"
□ Key: "MSP"
□ Type: "Standalone"
□ Create
```

### Phase 4: Configure in MSP Assistant (5 min)
```bash
# Edit backend/.env
YOUTRACK_URL=https://your-instance.youtrack.cloud
YOUTRACK_TOKEN=pltxxxxxxxxxxxxxxxxxxxx
YOUTRACK_PROJECT=MSP
YOUTRACK_ISSUE_LINK_BASE=https://your-instance.youtrack.cloud/issues

# Restart backend
cd backend
python -m uvicorn app.main:app --reload

# Test connection
curl -X POST http://localhost:8000/api/youtrack/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

✅ **YouTrack Setup Complete!**

---

## 🚀 CI/CD SETUP (30 MINUTES)

### Phase 1: AWS Credentials (5 min)

```bash
# Step 1: Create IAM User
□ AWS Console → IAM → Users → Create User
□ Name: "msp-assistant-cicd"
□ Programmatic access
□ Attach policies:
  - AmazonEC2ContainerRegistryPowerUser
  - AmazonECS_FullAccess
  - AmazonS3FullAccess
  - CloudFrontFullAccess
  - AmazonDynamoDBFullAccess
  - CloudWatchFullAccess
□ Create & COPY Access Key + Secret Key
```

### Phase 2: GitHub Secrets (5 min)

```bash
# Go to: GitHub → Settings → Secrets and variables → Actions

# Add these secrets:
□ AWS_ACCESS_KEY_ID = your-access-key
□ AWS_SECRET_ACCESS_KEY = your-secret-key
□ AWS_ACCOUNT_ID = 123456789012 (from AWS console)
□ AWS_REGION = us-east-1
□ ECR_REPOSITORY_NAME = msp-assistant-backend
□ ECS_CLUSTER_NAME = msp-assistant-cluster
□ ECS_SERVICE_NAME = msp-assistant-service
□ S3_BUCKET_NAME = msp-assistant-frontend-prod
□ CLOUDFRONT_DISTRIBUTION_ID = E123ABC456 (if you have one)
□ TEAMS_WEBHOOK_URL = https://... (get from Teams integration)
```

### Phase 3: AWS Infrastructure (10 min)

```bash
# Create ECR Repository
aws ecr create-repository \
    --repository-name msp-assistant-backend \
    --region us-east-1

# Create S3 Bucket
aws s3 mb s3://msp-assistant-frontend-prod --region us-east-1

# Create DynamoDB Tables
aws dynamodb create-table \
    --table-name msp-costs \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST
□ (repeat for msp-alerts, msp-users, msp-chat)

# Optional: Deploy Terraform
cd deployment/terraform
□ terraform init
□ terraform plan
□ terraform apply
```

### Phase 4: Trigger First Deployment (5 min)

```bash
# Make a test commit
echo "CI/CD Ready" >> README.md
git add .
git commit -m "test: trigger CI/CD"
git push origin main

# Monitor deployment
□ Go to GitHub → Actions tab
□ Watch workflow progress
□ Total time: 20-40 minutes
□ Check for green checkmark ✅
```

✅ **CI/CD Setup Complete!**

---

## ✅ VERIFICATION CHECKLIST

### YouTrack Verification
```
□ Can access YouTrack UI
□ Can login with credentials
□ MSP project exists
□ API token generated
□ Can test connection: curl test endpoint ✅
□ Backend restarted successfully
□ No errors in backend logs
□ Test ticket created
□ Can view ticket in YouTrack UI
```

### CI/CD Verification
```
□ GitHub secrets all added (10 total)
□ AWS IAM user created
□ ECR repository created
□ S3 bucket created
□ DynamoDB tables created
□ GitHub Actions enabled
□ First deployment triggered
□ Deployment completed ✅
□ All stages green (tests, build, deploy)
□ ECS tasks running
□ Frontend deployed to S3
□ Teams notification received
```

### System Verification
```
□ Backend running: curl http://localhost:8000/health ✅
□ Frontend running: http://localhost:3001 ✅
□ YouTrack connected: /api/youtrack/config ✅
□ Can create manual issue in YouTrack ✅
□ Can create issue from API ✅
□ GitHub Actions workflow runs on push ✅
□ Deployment happens automatically ✅
```

---

## 🎯 NEXT IMMEDIATE STEPS

### TODAY (Day 1)
```
□ Complete YouTrack setup (20 min)
  └─ Instance → Token → Project → Config
□ Complete CI/CD setup (30 min)
  └─ IAM → GitHub Secrets → AWS Resources → Deploy
□ Run verification checks (10 min)
  └─ Test connections, verify deployments
```

### THIS WEEK (Days 2-3)
```
□ Test alert → ticket workflow
  └─ Trigger test alert
  └─ Verify ticket created in YouTrack
  └─ Verify Teams notification sent

□ Configure team access
  └─ Add team members to YouTrack
  └─ Set up team workflows
  └─ Create monitoring dashboard

□ Set up production credentials
  └─ Configure real AWS credentials
  └─ Connect to real Cost Explorer
  └─ Enable real security scanning
```

### NEXT WEEK (Days 4-7)
```
□ Load testing
  └─ Test with realistic traffic

□ Security testing
  └─ Penetration test
  └─ Vulnerability scan

□ Team training
  └─ Show team how to use platform
  └─ Train on YouTrack workflows
  └─ Explain alert response process
```

---

## 🔗 Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| **YOUTRACK_SETUP_GUIDE.md** | Step-by-step YouTrack setup | 10 min |
| **YOUTRACK_API_REFERENCE.md** | API endpoint reference | 5 min |
| **CICD_SETUP_GUIDE.md** | Step-by-step CI/CD setup | 15 min |
| **IMPLEMENTATION_SUMMARY.md** | Overview of what was added | 10 min |
| **ARCHITECTURE_DIAGRAM.md** | Visual architecture diagrams | 10 min |
| **HOW_TO_RUN_LOCAL.md** | Run locally setup | 10 min |
| **LOCAL_TESTING_GUIDE.md** | Test all 94 features | 30 min |

**Recommended Reading Order:**
1. Start: This file (5 min)
2. Then: YOUTRACK_SETUP_GUIDE.md (10 min)
3. Then: CICD_SETUP_GUIDE.md (15 min)
4. Reference: YOUTRACK_API_REFERENCE.md (as needed)
5. Deep dive: ARCHITECTURE_DIAGRAM.md (if interested)

---

## 🚨 Common Issues & Quick Fixes

### Issue: "YouTrack not configured"
```bash
✅ FIX:
1. Check .env has all 4 YouTrack variables
2. Restart backend: Ctrl+C, then run again
3. Verify values don't have spaces
4. Test: curl http://localhost:8000/api/youtrack/config
```

### Issue: GitHub Secrets not working
```bash
✅ FIX:
1. Go to Settings → Secrets → check all 10 are there
2. Look for typos (case-sensitive)
3. No spaces before/after values
4. Wait 1-2 minutes for GitHub to update
5. Retrigger workflow
```

### Issue: ECR push failing
```bash
✅ FIX:
1. Verify AWS credentials in GitHub secrets
2. Check IAM user has ECR permissions
3. Try locally: aws ecr describe-repositories
4. If error: get new access key in IAM
```

### Issue: Deployment stuck
```bash
✅ FIX:
1. Check ECS task status: aws ecs describe-tasks
2. View logs: aws logs tail /ecs/msp-assistant --follow
3. Check health of tasks
4. If stuck: manually rollback in AWS console
5. Check GitHub Actions logs for errors
```

### Issue: S3 deployment failing
```bash
✅ FIX:
1. Verify bucket exists: aws s3 ls
2. Check bucket name matches in secrets
3. Verify IAM user has S3 permissions
4. Check bucket has public access blocked
```

---

## 📞 Quick Commands Reference

### YouTrack Commands
```bash
# Test connection
curl -X POST http://localhost:8000/api/youtrack/test \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create test ticket
curl -X POST http://localhost:8000/api/youtrack/issues \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test issue","priority":"Low"}'

# Search tickets
curl -X POST http://localhost:8000/api/youtrack/search \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"priority: Critical","limit":10}'
```

### CI/CD Commands
```bash
# Deploy manually
gh workflow run deploy.yml -r main

# Check deployment status
gh run list --workflow deploy.yml

# View logs
aws logs tail /ecs/msp-assistant --follow

# Check ECS status
aws ecs describe-services \
  --cluster msp-assistant-cluster \
  --services msp-assistant-service
```

### AWS Commands
```bash
# List ECR repos
aws ecr describe-repositories

# List S3 buckets
aws s3 ls

# Check DynamoDB tables
aws dynamodb list-tables

# View CloudWatch logs
aws logs tail /ecs/msp-assistant --follow
```

---

## 🎓 Learning Resources

### Helpful Links
- **YouTrack Docs**: https://www.jetbrains.com/help/youtrack/
- **AWS ECS**: https://aws.amazon.com/ecs/
- **GitHub Actions**: https://docs.github.com/en/actions
- **FastAPI**: https://fastapi.tiangolo.com/
- **React**: https://react.dev/

### Example Workflows
- See `.github/workflows/deploy.yml` for GitHub Actions
- See `backend/app/api/youtrack.py` for API examples
- See `YOUTRACK_API_REFERENCE.md` for endpoint examples

---

## ✨ What You Can Do Now

✅ **Automatically create tickets from alerts**
- Cost spike detected → YouTrack ticket created
- Security issue found → Ticket created with details
- Performance alert triggered → Ticket created automatically
- Team notified via Teams/Slack with ticket link

✅ **Deploy code automatically**
- Push to main → Tests run
- Tests pass → Docker image built
- Image pushed to ECR
- ECS service updated
- Frontend deployed to S3
- CloudFront cache invalidated
- Zero downtime deployment

✅ **Monitor everything**
- CloudWatch metrics
- Deployment logs
- Health checks
- Auto-rollback if issues

✅ **Track everything**
- YouTrack dashboard shows all issues
- Slack/Teams shows notifications
- Reports generated automatically
- Audit trail of all changes

---

## 📊 Deployment Metrics

**First Deployment Usually Takes:**
- ⏱️ Tests: 5-10 minutes
- ⏱️ Build: 10-15 minutes
- ⏱️ Deploy: 5-10 minutes
- ⏱️ **Total: 20-35 minutes**

**Subsequent Deployments:**
- Usually 20-30 minutes (cache helps)
- Can be faster with minor changes

---

## 🎉 You're Ready!

### What's Now Available:
```
✅ Local Development
   - Run backend + frontend locally
   - Hot reload on code changes
   - Full debuggable environment

✅ Automatic Deployment
   - Push code → Automatic deployment
   - Tests + Build + Deploy in one workflow
   - Zero downtime updates

✅ Ticket Management
   - Alerts → YouTrack tickets automatically
   - Team collaboration on issues
   - Tracking of resolution time

✅ Alert Notifications
   - Teams notifications
   - Slack notifications
   - Email alerts (optional)

✅ Monitoring & Logging
   - CloudWatch metrics
   - Log aggregation
   - Performance dashboards
   - Alert alarms
```

---

## 📝 Your Next Steps

**Choose one:**

### Option A: Setup YouTrack Now
→ Follow `YOUTRACK_SETUP_GUIDE.md`
⏱️ Time: 20 minutes
📚 Then read: YOUTRACK_API_REFERENCE.md

### Option B: Setup CI/CD Now
→ Follow `CICD_SETUP_GUIDE.md`
⏱️ Time: 30 minutes
📚 Then read: ARCHITECTURE_DIAGRAM.md

### Option C: Both (Recommended)
→ Do YouTrack first (20 min)
→ Then CI/CD (30 min)
→ Total: 50 minutes
✅ Full system ready!

---

## 🏁 Success Criteria

You'll know you're done when:

**YouTrack:**
- ✅ Can access YouTrack UI
- ✅ Can create test ticket via API
- ✅ Backend `/api/youtrack/test` shows "success"

**CI/CD:**
- ✅ GitHub Actions shows green checkmarks
- ✅ ECS tasks are running
- ✅ Frontend deployed to S3
- ✅ Received Teams notification

**Integration:**
- ✅ Trigger test alert → ticket created
- ✅ Teams/Slack notification received
- ✅ Can view ticket in YouTrack
- ✅ All systems working together

---

**You're all set! Choose your next step above and get started. 🚀**

