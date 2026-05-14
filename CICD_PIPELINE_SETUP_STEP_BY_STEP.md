# CI/CD Pipeline - Complete Step-by-Step Guide

## 🎯 What is CI/CD?

**CI** = Continuous Integration (auto test code)
**CD** = Continuous Deployment (auto deploy code)

```
You Push Code
    ↓ (GitHub detects push)
Automatic Tests Run
    ↓ (Tests pass/fail)
If Pass → Build Docker Image
    ↓
Push to AWS ECR
    ↓
Deploy to ECS Fargate
    ↓
Frontend Updates to S3
    ↓
CloudFront Cache Updated
    ↓
Teams Notification Sent
    ↓
LIVE! Users see changes (Zero downtime)
```

---

## 📋 Prerequisites Checklist

Before starting, you need:

```
□ GitHub Account & Repository
□ AWS Account with credentials configured
□ Docker installed locally
□ Git installed locally
□ AWS CLI installed and configured
□ PowerShell or Bash terminal
```

---

## ✅ STEP 1: Set Up GitHub Repository (10 minutes)

### 1.1: Create GitHub Repository

**Option A: Create on GitHub.com**
1. Go to: https://github.com/new
2. Repository name: `msp-assistant`
3. Description: `AWS Cost Intelligence Platform`
4. Visibility: Private (for safety)
5. Click "Create repository"

**Option B: Use CLI**
```bash
gh repo create msp-assistant --private --source=. --remote=origin --push
```

### 1.2: Push Your Code to GitHub

```bash
# Go to project root
cd d:\One Data Solution\AWS AI agent

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: MSP Assistant with YouTrack and CI/CD"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/msp-assistant.git

# Push to GitHub
git branch -M main
git push -u origin main

# Verify on GitHub.com
# You should see all files in your repository
```

---

## 🔑 STEP 2: Set Up AWS IAM User (15 minutes)

### 2.1: Create IAM User for CI/CD

**Go to AWS Console:**
```
1. Search: IAM
2. Click: Users
3. Click: Create user
4. User name: msp-assistant-cicd
5. Click: Next
```

### 2.2: Attach Permissions

**Select Policies:**
```
1. Click: Attach policies directly
2. Search and check these:
   ☑ AmazonEC2ContainerRegistryPowerUser
   ☑ AmazonECS_FullAccess
   ☑ AmazonS3FullAccess
   ☑ CloudFrontFullAccess
   ☑ AmazonDynamoDBFullAccess
   ☑ CloudWatchFullAccess
   ☑ IAMFullAccess (for role creation)
3. Click: Next
4. Review and click: Create user
```

### 2.3: Generate Access Keys

**In IAM User Page:**
```
1. Click: Security credentials tab
2. Scroll to: Access keys
3. Click: Create access key
4. Select: Command Line Interface (CLI)
5. Click: Create access key
6. IMPORTANT: Copy both:
   - Access Key ID
   - Secret Access Key
   (Save these safely - you'll need them!)
```

---

## 🐙 STEP 3: Add GitHub Secrets (10 minutes)

### 3.1: Go to GitHub Secrets

```
1. Your repository on GitHub.com
2. Click: Settings (top right)
3. Click: Secrets and variables → Actions
4. Click: New repository secret
```

### 3.2: Add Each Secret

**Add Secret 1: AWS_ACCESS_KEY_ID**
```
Name: AWS_ACCESS_KEY_ID
Value: [paste from Step 2.3]
Click: Add secret
```

**Add Secret 2: AWS_SECRET_ACCESS_KEY**
```
Name: AWS_SECRET_ACCESS_KEY
Value: [paste from Step 2.3]
Click: Add secret
```

**Add Secret 3: AWS_ACCOUNT_ID**
```
Name: AWS_ACCOUNT_ID
Value: [your AWS account ID, e.g., 123456789012]
       (Find in AWS Console top right)
Click: Add secret
```

**Add Secret 4: AWS_REGION**
```
Name: AWS_REGION
Value: ap-south-1
Click: Add secret
```

**Add Secret 5: ECR_REPOSITORY_NAME**
```
Name: ECR_REPOSITORY_NAME
Value: msp-assistant-backend
Click: Add secret
```

**Add Secret 6: ECS_CLUSTER_NAME**
```
Name: ECS_CLUSTER_NAME
Value: msp-assistant-cluster
Click: Add secret
```

**Add Secret 7: ECS_SERVICE_NAME**
```
Name: ECS_SERVICE_NAME
Value: msp-assistant-service
Click: Add secret
```

**Add Secret 8: S3_BUCKET_NAME**
```
Name: S3_BUCKET_NAME
Value: msp-assistant-frontend-prod
Click: Add secret
```

**Add Secret 9: CLOUDFRONT_DISTRIBUTION_ID**
```
Name: CLOUDFRONT_DISTRIBUTION_ID
Value: [leave empty for now, update later]
Click: Add secret
```

**Add Secret 10: TEAMS_WEBHOOK_URL**
```
Name: TEAMS_WEBHOOK_URL
Value: https://outlook.webhook.office.com/...
       (Get from Teams integration setup)
Click: Add secret
```

### 3.3: Verify All 10 Secrets Added

```
Go to: Settings → Secrets
You should see all 10 secrets listed:
☑ AWS_ACCESS_KEY_ID
☑ AWS_SECRET_ACCESS_KEY
☑ AWS_ACCOUNT_ID
☑ AWS_REGION
☑ ECR_REPOSITORY_NAME
☑ ECS_CLUSTER_NAME
☑ ECS_SERVICE_NAME
☑ S3_BUCKET_NAME
☑ CLOUDFRONT_DISTRIBUTION_ID
☑ TEAMS_WEBHOOK_URL
```

---

## 🏗️ STEP 4: Create AWS Infrastructure (20 minutes)

### 4.1: Create ECR Repository

```bash
# Run this command
aws ecr create-repository \
    --repository-name msp-assistant-backend \
    --region ap-south-1

# Response will show:
# "repositoryUri": "123456789012.dkr.ecr.ap-south-1.amazonaws.com/msp-assistant-backend"
```

### 4.2: Create S3 Bucket for Frontend

```bash
# Create bucket
aws s3 mb s3://msp-assistant-frontend-prod --region ap-south-1

# Enable versioning
aws s3api put-bucket-versioning \
    --bucket msp-assistant-frontend-prod \
    --versioning-configuration Status=Enabled \
    --region ap-south-1

# Block public access
aws s3api put-public-access-block \
    --bucket msp-assistant-frontend-prod \
    --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
    --region ap-south-1
```

### 4.3: Verify Infrastructure Created

```bash
# Check ECR
aws ecr describe-repositories --region ap-south-1

# Check S3
aws s3 ls --region ap-south-1

# Both should show your resources
```

---

## 🔄 STEP 5: Configure GitHub Actions Workflow (5 minutes)

The workflow file is already at: `.github/workflows/deploy.yml`

### 5.1: Verify Workflow File Exists

```bash
# Check if file exists
ls .github/workflows/deploy.yml

# Should exist with 200+ lines of deployment logic
```

### 5.2: Workflow Stages Explained

```
STAGE 1: TESTS (5-10 minutes)
├─ Run backend tests (pytest)
├─ Run frontend tests (npm)
├─ Check code quality (flake8, black)
├─ Check types (mypy)
└─ Scan for security issues (Trivy)

STAGE 2: BUILD (10-15 minutes)
├─ Build Docker image
└─ Push to ECR

STAGE 3: DEPLOY (5-10 minutes)
├─ Update ECS service
├─ Deploy frontend to S3
├─ Invalidate CloudFront
└─ Send Teams notification
```

---

## 🧪 STEP 6: Test the CI/CD Pipeline (10 minutes)

### 6.1: Make a Test Commit

```bash
# Create a simple test file
echo "CI/CD Test" >> CICD_TEST.txt

# Commit and push
git add CICD_TEST.txt
git commit -m "test: trigger CI/CD pipeline"
git push origin main

# This triggers GitHub Actions!
```

### 6.2: Monitor Deployment in GitHub

**Go to GitHub:**
```
1. Your repository
2. Click: Actions (top menu)
3. You should see: "test: trigger CI/CD pipeline" workflow running
4. Click on it to see detailed logs

Watch these sections complete:
☐ Tests
☐ Build
☐ Deploy
```

### 6.3: Check Logs in Real-Time

**If Tests Fail:**
```
Click workflow → Failed job → See error
Common fixes:
- Missing dependencies: pip install -r requirements.txt
- Wrong Python version: Should be 3.11+
- Wrong Node version: Should be 18+
```

**If Build Fails:**
```
Usually means Docker image can't build
Check: Docker file syntax, missing dependencies
```

**If Deploy Fails:**
```
Check: AWS credentials in secrets
Check: ECS cluster exists
Check: S3 bucket exists
```

---

## 🎯 STEP 7: Monitor First Deployment (15-30 minutes)

### 7.1: Watch GitHub Actions

```
Expected timeline:
0-5 min:   Tests running...
5-10 min:  Build starting...
10-25 min: Docker build + push...
25-30 min: ECS deployment...
30-35 min: Frontend sync...
35-40 min: Done! ✅
```

### 7.2: Check ECS Status

**During deployment:**
```bash
# Check service status
aws ecs describe-services \
    --cluster msp-assistant-cluster \
    --services msp-assistant-service \
    --region ap-south-1

# Look for: "runningCount": should increase
```

### 7.3: Check Logs

**View deployment logs:**
```bash
# Follow ECS logs
aws logs tail /ecs/msp-assistant --follow --region ap-south-1

# You should see:
# INFO: Application startup complete
```

### 7.4: Verify Frontend Deployed

```bash
# Check S3 has new files
aws s3 ls s3://msp-assistant-frontend-prod/ --recursive --region ap-south-1

# Should show: index.html, assets/, etc.
```

---

## ✅ STEP 8: Verification Checklist (10 minutes)

After first deployment completes, verify:

```
☑ GitHub Actions shows green checkmark
☑ All 3 stages completed (Tests, Build, Deploy)
☑ No red X or errors in workflow
☑ ECS service has 2+ running tasks
☑ S3 bucket has frontend files
☑ Backend API responding: curl http://localhost:8000/health
☑ Frontend loads: http://localhost:3001
☑ Teams notification received (if webhook configured)
```

---

## 🔄 STEP 9: Regular Workflow (Daily Development)

### 9.1: Development Cycle

```
1. Create feature branch
   git checkout -b feature/new-feature

2. Make code changes
   (tests run locally)

3. Commit and push
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature

4. Create Pull Request on GitHub
   (CI/CD runs tests, doesn't deploy yet)

5. Review and merge PR
   (When merged to main, CI/CD deploys automatically)

6. Watch automatic deployment
   GitHub Actions → Tests → Build → Deploy → Live!
```

### 9.2: What Gets Tested

```bash
# Backend Tests
├─ pytest tests/        (unit tests)
├─ flake8 app/         (code style)
├─ black --check app/  (formatting)
└─ mypy app/           (type checking)

# Frontend Tests
├─ npm run lint        (code quality)
├─ npm run type-check  (TypeScript)
└─ npm run build       (production build)

# Security
└─ Trivy scan          (vulnerability scan)
```

---

## 🚀 STEP 10: Production Deployment (When Ready)

### 10.1: Deploy to AWS ECS Fargate

```bash
# First time only: Create ECS resources
cd deployment/terraform
terraform init
terraform plan
terraform apply

# This creates:
# ✅ ECS Cluster
# ✅ ECS Service
# ✅ Task Definition
# ✅ Load Balancer
# ✅ Auto Scaling Groups
# ✅ CloudWatch Logs
```

### 10.2: Update GitHub Secrets with Real Values

```bash
# Get values from Terraform output
terraform output

# Update these GitHub secrets:
CLOUDFRONT_DISTRIBUTION_ID = [from output]
ECS_CLUSTER_NAME = [from output]
ECS_SERVICE_NAME = [from output]
```

### 10.3: Configure Custom Domain (Optional)

```
1. Buy domain: GoDaddy, Route53, etc.
2. Go to Route53 in AWS Console
3. Create hosted zone
4. Add A record pointing to ALB
5. Configure SSL certificate in ACM
6. Update CloudFront with certificate
```

---

## 📊 Architecture Diagram

```
Developer (You)
    ↓
Pushes code to GitHub
    ↓
GitHub detects push
    ↓
Webhook triggers GitHub Actions
    ↓
┌─────────────────────────┐
│ STAGE 1: TEST (5 min)   │
├─────────────────────────┤
│ ├─ Backend tests        │
│ ├─ Frontend tests       │
│ ├─ Code quality        │
│ └─ Security scan       │
└─────────────────────────┘
    ↓ (if all pass)
┌─────────────────────────┐
│ STAGE 2: BUILD (15 min) │
├─────────────────────────┤
│ ├─ Build Docker image  │
│ └─ Push to ECR         │
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ STAGE 3: DEPLOY (10 min)│
├─────────────────────────┤
│ ├─ Update ECS          │
│ ├─ Update S3           │
│ ├─ Invalidate CDN      │
│ └─ Notify Teams        │
└─────────────────────────┘
    ↓
✅ LIVE! Zero downtime update
```

---

## 🛑 Stop Deployment (If Needed)

### Stop a Running Workflow

```bash
# Go to GitHub Actions
# Click on running workflow
# Click: Cancel workflow run

# Or via CLI:
gh run cancel RUN_ID
```

### Rollback a Deployment

```bash
# Revert to previous version
aws ecs update-service \
    --cluster msp-assistant-cluster \
    --service msp-assistant-service \
    --force-new-deployment \
    --region ap-south-1

# This redeploys with previous task definition
```

---

## 📈 Monitoring & Debugging

### View Live Logs

```bash
# Backend logs
aws logs tail /ecs/msp-assistant --follow --region ap-south-1

# Deployment logs
aws logs tail /aws/ecs/msp-assistant-cluster --follow --region ap-south-1
```

### Check Service Health

```bash
# Service status
aws ecs describe-services \
    --cluster msp-assistant-cluster \
    --services msp-assistant-service \
    --region ap-south-1

# Task status
aws ecs list-tasks \
    --cluster msp-assistant-cluster \
    --service-name msp-assistant-service \
    --region ap-south-1
```

### Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Tests fail | Missing dependencies | `pip install -r requirements.txt` |
| Build fails | Docker error | Check Dockerfile syntax |
| Deploy fails | ECS issue | Check cluster exists, ALB healthy |
| Frontend not updating | S3 sync issue | Check S3 bucket exists, permissions |
| CloudFront not updating | Cache issue | Check distribution ID in secrets |

---

## ✨ Complete CI/CD Workflow Summary

```
1. Code changes locally
2. git push to GitHub main branch
3. GitHub Actions automatically triggered
4. Stage 1: Tests run (pass/fail)
5. Stage 2: Docker image built
6. Stage 3: Deployed to ECS
7. Frontend synced to S3
8. CloudFront cache invalidated
9. Teams notification sent
10. Users see changes immediately (zero downtime)
```

**Time for full pipeline: 30-40 minutes**

---

## 🎯 Success Indicators

✅ You've succeeded when:
- GitHub Actions shows green checkmarks
- ECS tasks are running
- Frontend updated in S3
- Teams notification received
- No errors in any logs

---

## 📞 Quick Reference

| Command | Purpose |
|---------|---------|
| `git push origin main` | Trigger CI/CD |
| `gh run list` | See workflow history |
| `gh run view` | See latest run details |
| `aws logs tail /ecs/msp-assistant --follow` | Watch logs |
| `aws ecs describe-services --cluster ... --services ...` | Check status |

---

## 🚀 Next Steps

**After completing all 10 steps:**
1. Read: `DEPLOYMENT_GUIDE.md` (production setup)
2. Configure: Real domain name
3. Enable: SSL certificate
4. Monitor: CloudWatch dashboard
5. Scale: Configure auto-scaling

---

**You now have a complete CI/CD pipeline! 🎉**

Every push triggers automatic tests, build, and deployment with zero downtime.

