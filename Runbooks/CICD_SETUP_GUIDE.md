# CI/CD Setup Guide - Step by Step

## 🎯 Overview

This guide walks you through setting up a complete CI/CD pipeline that:
- ✅ Automatically tests your code
- ✅ Builds Docker images
- ✅ Pushes to AWS ECR (container registry)
- ✅ Deploys to ECS Fargate
- ✅ Updates frontend in S3
- ✅ Invalidates CloudFront cache
- ✅ Sends Teams notifications

**Total Setup Time**: ~30 minutes

---

## 📋 Prerequisites

Before starting, you need:

- ✅ AWS Account with billing enabled
- ✅ GitHub account with repository access
- ✅ Code pushed to GitHub repository
- ✅ Docker installed locally (for testing)
- ✅ AWS CLI installed and configured
- ✅ Microsoft Teams (for notifications)

**Check Prerequisites:**

```bash
# AWS CLI
aws --version
# Expected: aws-cli/2.x.x

# Docker
docker --version
# Expected: Docker version 20.x.x

# GitHub CLI (optional but recommended)
gh --version
# Expected: gh version x.x.x
```

---

## 🔑 STEP 1: Set Up AWS Credentials (5 minutes)

### 1.1 Create IAM User for CI/CD

The CI/CD pipeline needs AWS permissions. We'll create a dedicated IAM user for this.

**Steps:**

1. Go to AWS Console → IAM → Users → Create User
   - User name: `msp-assistant-cicd`
   - Select "Programmatic access"
   - Click "Next: Permissions"

2. Attach permissions:
   - Click "Attach existing policies directly"
   - Search for and attach these policies:
     - `AmazonEC2ContainerRegistryPowerUser` (ECR access)
     - `AmazonECS_FullAccess` (ECS Fargate)
     - `AmazonS3FullAccess` (S3 for frontend)
     - `CloudFrontFullAccess` (CloudFront invalidation)
     - `AmazonDynamoDBFullAccess` (DynamoDB)
     - `CloudWatchFullAccess` (Logging)
   - Click "Next: Tags" → Skip → "Create user"

3. **IMPORTANT**: Copy the Access Key ID and Secret Access Key
   - Don't lose these! You'll need them in Step 2

**Verify Access:**

```bash
# Test with AWS CLI (replace with your credentials)
export AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
export AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
export AWS_REGION=us-east-1

aws sts get-caller-identity
# Should show your account ID
```

---

## 🐙 STEP 2: Set Up GitHub Secrets (5 minutes)

### 2.1 Navigate to GitHub Secrets

1. Open your GitHub repository
2. Go to: **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### 2.2 Add Required Secrets

Add these secrets one by one:

**Secret 1: AWS Access Key ID**
- Name: `AWS_ACCESS_KEY_ID`
- Value: _(paste from Step 1.3)_
- Click "Add secret"

**Secret 2: AWS Secret Access Key**
- Name: `AWS_SECRET_ACCESS_KEY`
- Value: _(paste from Step 1.3)_
- Click "Add secret"

**Secret 3: AWS Account ID**
- Name: `AWS_ACCOUNT_ID`
- Value: _(your AWS account ID, e.g., 123456789012)_
- Click "Add secret"

**Secret 4: AWS Region**
- Name: `AWS_REGION`
- Value: `us-east-1`
- Click "Add secret"

**Secret 5: Teams Webhook (Optional)**
- Name: `TEAMS_WEBHOOK_URL`
- Value: _(your Teams webhook URL or dummy for now)_
- Click "Add secret"

**Secret 6: ECR Repository Name**
- Name: `ECR_REPOSITORY_NAME`
- Value: `msp-assistant-backend`
- Click "Add secret"

**Secret 7: ECS Service Name**
- Name: `ECS_SERVICE_NAME`
- Value: `msp-assistant-service`
- Click "Add secret"

**Secret 8: ECS Cluster Name**
- Name: `ECS_CLUSTER_NAME`
- Value: `msp-assistant-cluster`
- Click "Add secret"

**Secret 9: S3 Bucket (Frontend)**
- Name: `S3_BUCKET_NAME`
- Value: `msp-assistant-frontend-prod`
- Click "Add secret"

**Secret 10: CloudFront Distribution**
- Name: `CLOUDFRONT_DISTRIBUTION_ID`
- Value: _(your CloudFront distribution ID, found in AWS console)_
- Click "Add secret"

**Verify Secrets Added:**

```
✅ AWS_ACCESS_KEY_ID
✅ AWS_SECRET_ACCESS_KEY
✅ AWS_ACCOUNT_ID
✅ AWS_REGION
✅ TEAMS_WEBHOOK_URL
✅ ECR_REPOSITORY_NAME
✅ ECS_SERVICE_NAME
✅ ECS_CLUSTER_NAME
✅ S3_BUCKET_NAME
✅ CLOUDFRONT_DISTRIBUTION_ID
```

---

## 🏗️ STEP 3: Set Up AWS Infrastructure (10 minutes)

### 3.1 Create ECR Repository

```bash
# Create ECR repository for Docker images
aws ecr create-repository \
    --repository-name msp-assistant-backend \
    --region us-east-1

# Expected output:
# {
#   "repository": {
#     "repositoryUri": "123456789012.dkr.ecr.us-east-1.amazonaws.com/msp-assistant-backend"
#   }
# }
```

Save the `repositoryUri` - you'll need it later.

### 3.2 Create S3 Bucket for Frontend

```bash
# Create S3 bucket
aws s3 mb s3://msp-assistant-frontend-prod --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
    --bucket msp-assistant-frontend-prod \
    --versioning-configuration Status=Enabled

# Block all public access (CloudFront will handle it)
aws s3api put-public-access-block \
    --bucket msp-assistant-frontend-prod \
    --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### 3.3 Create DynamoDB Tables (if not already created)

```bash
# Costs table
aws dynamodb create-table \
    --table-name msp-costs \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1

# Alerts table
aws dynamodb create-table \
    --table-name msp-alerts \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1

# Users table
aws dynamodb create-table \
    --table-name msp-users \
    --attribute-definitions AttributeName=email,AttributeType=S \
    --key-schema AttributeName=email,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1

# Chat table
aws dynamodb create-table \
    --table-name msp-chat \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

### 3.4 Deploy Infrastructure with Terraform (Optional but Recommended)

If you haven't deployed infrastructure yet:

```bash
# Initialize Terraform
cd deployment/terraform
terraform init

# Plan the deployment (review what will be created)
terraform plan

# Apply the deployment (creates all AWS resources)
terraform apply

# Note the outputs - you'll need them later
```

---

## 📝 STEP 4: Configure GitHub Actions Workflow (Already Done)

The workflow file `.github/workflows/deploy.yml` is already configured. Let's verify it:

### 4.1 Verify Workflow File

The file at `.github/workflows/deploy.yml` should contain:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Jobs defined in the workflow
```

**Check if file exists:**

```bash
# From project root
ls -la .github/workflows/deploy.yml

# Should show the file exists
```

### 4.2 Understand the Workflow

The workflow has these stages:

**Stage 1: TESTS** (5 min)
```
├─ Backend Tests (pytest)
├─ Frontend Tests (npm)
├─ Code Quality (flake8, black)
├─ Type Checking (mypy)
└─ Security Scan (Trivy)
```

**Stage 2: BUILD** (10 min)
```
├─ Build Docker image
└─ Push to ECR
```

**Stage 3: DEPLOY** (5 min)
```
├─ Update ECS service
├─ Deploy frontend to S3
├─ Invalidate CloudFront
└─ Send Teams notification
```

---

## 🚀 STEP 5: Trigger Your First Deployment (5 minutes)

### 5.1 Make a Test Commit

```bash
# Create a simple change
echo "# Deployment Ready" >> README_DEPLOY.md

# Commit and push
git add .
git commit -m "test: trigger CI/CD pipeline"
git push origin main
```

### 5.2 Monitor Deployment

1. Go to GitHub → Your Repository → **Actions** tab
2. Click on your latest workflow run
3. Watch the stages complete:
   - 🟡 Tests (running...)
   - 🟡 Build (waiting...)
   - 🟡 Deploy (waiting...)

**Expected Timeline:**
- Tests: 5-10 minutes
- Build: 10-15 minutes
- Deploy: 5-10 minutes
- **Total**: 20-35 minutes for first deployment

### 5.3 Check Deployment Status

Once deployment completes:

```bash
# Check ECS service
aws ecs describe-services \
    --cluster msp-assistant-cluster \
    --services msp-assistant-service \
    --region us-east-1

# Should show: "runningCount": 2 (or your desired count)

# Check S3 frontend
aws s3 ls s3://msp-assistant-frontend-prod/ --recursive

# Should show your built frontend files
```

---

## 📊 STEP 6: Set Up Monitoring (10 minutes)

### 6.1 Create CloudWatch Dashboard

```bash
# Create a basic dashboard
aws cloudwatch put-dashboard \
    --dashboard-name MSPAssistant \
    --dashboard-body file://dashboard-config.json \
    --region us-east-1
```

**Create `dashboard-config.json`:**

```json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/ECS", "CPUUtilization", {"stat": "Average"}],
          ["AWS/ECS", "MemoryUtilization", {"stat": "Average"}],
          ["AWS/ApplicationELB", "TargetResponseTime", {"stat": "Average"}],
          ["AWS/ApplicationELB", "HTTPCode_Target_5XX_Count", {"stat": "Sum"}]
        ],
        "period": 60,
        "stat": "Average",
        "region": "us-east-1",
        "title": "MSP Assistant Performance"
      }
    }
  ]
}
```

### 6.2 Create CloudWatch Alarms

```bash
# CPU Alarm (alert if > 80%)
aws cloudwatch put-metric-alarm \
    --alarm-name msp-assistant-high-cpu \
    --alarm-description "Alert when CPU exceeds 80%" \
    --metric-name CPUUtilization \
    --namespace AWS/ECS \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2 \
    --region us-east-1

# Memory Alarm (alert if > 85%)
aws cloudwatch put-metric-alarm \
    --alarm-name msp-assistant-high-memory \
    --alarm-description "Alert when Memory exceeds 85%" \
    --metric-name MemoryUtilization \
    --namespace AWS/ECS \
    --statistic Average \
    --period 300 \
    --threshold 85 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2 \
    --region us-east-1
```

---

## 🔄 STEP 7: Daily Workflow (Ongoing)

### 7.1 Development

**Make code changes:**

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# ... edit files ...

# Test locally
npm run dev  # Frontend
python -m uvicorn app.main:app --reload  # Backend

# Commit
git add .
git commit -m "feat: add new feature"

# Push
git push origin feature/new-feature
```

### 7.2 Create Pull Request

```bash
# On GitHub: Create Pull Request from feature branch to main
# CI/CD will automatically:
# ✅ Run tests
# ✅ Check code quality
# ✅ Build Docker image
# ⚠️ NOT deploy (only on merge to main)
```

### 7.3 Merge to Main

```bash
# After PR review and approval:
# Merge PR on GitHub

# Or via CLI:
git checkout main
git pull origin main
git merge feature/new-feature
git push origin main
```

**Automatic Deployment Triggered:**
- ✅ Tests run
- ✅ Docker image built and pushed
- ✅ ECS service updated
- ✅ Frontend deployed to S3
- ✅ CloudFront invalidated
- ✅ Teams notification sent

---

## 🛠️ STEP 8: Common Tasks

### 8.1 Manually Trigger Deployment

If you need to deploy without code changes:

```bash
# Via GitHub Actions UI:
# 1. Go to Actions → Deploy to AWS
# 2. Click "Run workflow"
# 3. Select branch (main)
# 4. Click "Run workflow"

# Via CLI:
gh workflow run deploy.yml -r main
```

### 8.2 Rollback to Previous Version

```bash
# If deployment has issues:
# 1. Go to AWS Console → ECS
# 2. Select msp-assistant-service
# 3. Click "Update service"
# 4. Change "Force new deployment" toggle
# 5. Click "Update" (reverts to previous task definition)

# Or via CLI:
aws ecs update-service \
    --cluster msp-assistant-cluster \
    --service msp-assistant-service \
    --force-new-deployment \
    --region us-east-1
```

### 8.3 View Logs

```bash
# Backend logs
aws logs tail /ecs/msp-assistant --follow

# Deployment logs
aws logs tail /aws/ecs/msp-assistant-cluster --follow

# GitHub Actions logs
# Go to Actions tab in GitHub → click workflow run
```

### 8.4 Scale Service

```bash
# Increase number of running containers
aws ecs update-service \
    --cluster msp-assistant-cluster \
    --service msp-assistant-service \
    --desired-count 4 \
    --region us-east-1
```

---

## ⚠️ Troubleshooting

### Issue: Tests Failing

```bash
# Check local tests first
cd backend && pytest tests/
cd frontend && npm run test

# Common fixes:
# 1. Install dependencies: npm install && pip install -r requirements.txt
# 2. Update imports if files moved
# 3. Check Python version: python --version (should be 3.11+)
```

### Issue: ECR Push Failing

```bash
# Verify AWS credentials
aws sts get-caller-identity

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
    docker login --username AWS --password-stdin \
    123456789012.dkr.ecr.us-east-1.amazonaws.com

# Check IAM permissions
# User needs: AmazonEC2ContainerRegistryPowerUser
```

### Issue: ECS Deployment Not Updating

```bash
# Check service status
aws ecs describe-services \
    --cluster msp-assistant-cluster \
    --services msp-assistant-service

# Check task definition
aws ecs describe-task-definition \
    --task-definition msp-assistant-backend

# View recent deployments
aws ecs describe-services \
    --cluster msp-assistant-cluster \
    --services msp-assistant-service \
    --query 'services[0].deployments'
```

### Issue: S3 Frontend Not Updating

```bash
# Check S3 bucket contents
aws s3 ls s3://msp-assistant-frontend-prod/ --recursive

# Check CloudFront cache
aws cloudfront list-distributions | grep msp-assistant

# Manually invalidate cache
aws cloudfront create-invalidation \
    --distribution-id DISTRIBUTION_ID \
    --paths "/*"
```

### Issue: Teams Webhook Not Working

```bash
# Test webhook manually
curl -X POST $TEAMS_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{
    "summary": "Test",
    "themeColor": "0078D4",
    "sections": [{
      "activityTitle": "MSP Assistant Deployment",
      "text": "Test notification"
    }]
  }'

# Verify webhook URL in GitHub secrets
# Go to Settings → Secrets → TEAMS_WEBHOOK_URL
```

---

## 📈 Monitoring Deployment Health

### View Real-Time Logs

```bash
# Follow ECS logs in real-time
aws logs tail /ecs/msp-assistant --follow --format short

# Follow deployment logs
aws logs tail /aws/ecs/msp-assistant-cluster --follow --format short
```

### Check Service Health

```bash
# Get service status
aws ecs describe-services \
    --cluster msp-assistant-cluster \
    --services msp-assistant-service \
    --query 'services[0].[status,runningCount,desiredCount]'

# Output should show: ACTIVE, 2, 2 (or your desired count)
```

### View Recent Deployments

```bash
# See deployment history
aws ecs describe-services \
    --cluster msp-assistant-cluster \
    --services msp-assistant-service \
    --query 'services[0].deployments[*].[id,status,createdAt]'
```

---

## ✅ Post-Deployment Checklist

After each deployment:

```
□ GitHub Actions workflow completed successfully
□ Docker image pushed to ECR
□ ECS service updated and running
□ Frontend deployed to S3
□ CloudFront invalidated
□ Teams notification received
□ CloudWatch alarms showing normal metrics
□ Application accessible at custom domain
□ Login page loads without errors
□ Dashboard displays correctly
□ No console errors in browser
```

---

## 🎓 Next Steps

1. **Set up continuous monitoring**
   - Create custom CloudWatch dashboards
   - Set up SNS notifications for alarms

2. **Implement automated testing**
   - Add more unit tests
   - Set up E2E tests
   - Add load testing

3. **Security hardening**
   - Enable WAF on ALB
   - Add VPC security groups
   - Enable CloudTrail logging
   - Set up Config rules

4. **Cost optimization**
   - Review auto-scaling policies
   - Analyze CloudFront usage
   - Optimize EC2 instance types
   - Set up budget alerts

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| **View workflows** | `gh workflow list` |
| **Run workflow** | `gh workflow run deploy.yml -r main` |
| **View logs** | `aws logs tail /ecs/msp-assistant --follow` |
| **Check service** | `aws ecs describe-services --cluster msp-assistant-cluster --services msp-assistant-service` |
| **Scale service** | `aws ecs update-service --cluster msp-assistant-cluster --services msp-assistant-service --desired-count 4` |
| **Rollback** | `aws ecs update-service --cluster msp-assistant-cluster --services msp-assistant-service --force-new-deployment` |
| **Check secrets** | `gh secret list` |
| **View GitHub Actions** | `gh run list` |
| **Cancel workflow** | `gh run cancel RUN_ID` |

---

**Setup Complete! ✅**

Your CI/CD pipeline is now ready for continuous deployment. Every push to `main` will automatically test, build, and deploy your application to AWS ECS Fargate.

For detailed information about the workflow, see `.github/workflows/deploy.yml`

