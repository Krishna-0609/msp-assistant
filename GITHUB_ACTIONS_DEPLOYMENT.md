# GitHub Actions - Automated Deployment Guide

## ✅ What You've Done

You've successfully set up **Fully Automated CI/CD Pipeline** with:
1. ✅ GitHub Secrets configured
2. ✅ Enhanced GitHub Actions workflow with Terraform integration
3. ✅ Code pushed to GitHub
4. ✅ Infrastructure as Code (IaC) ready to deploy

---

## 🚀 How Deployment Works Now

### **Step 1: Push Code to GitHub (DONE ✓)**
```bash
git push -u origin main
```

### **Step 2: GitHub Actions Automatically Runs (Watch Here)**
Go to: https://github.com/Krishna-0609/msp-assistant/actions

The workflow will:
1. **Test Phase** - Run backend and frontend tests
2. **Infrastructure Phase** - Terraform deploys AWS resources:
   - ECS Cluster
   - ECR Repository
   - DynamoDB Tables
   - S3 Buckets
   - IAM Roles
3. **Build Phase** - Build Docker image for backend
4. **Deploy Phase** - Deploy to AWS:
   - Backend → ECS Fargate
   - Frontend → S3 + CloudFront
5. **Notify Phase** - Send Teams notification (optional)

---

## 📊 Deployment Pipeline Flow

```
┌─────────────────────────────────────────┐
│         GitHub Push to main             │
└────────────────┬────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │   Run Tests    │
        └────────┬───────┘
                 │
        ┌────────▼────────────────┐
        │  Deploy Infrastructure  │
        │   (Terraform)           │
        │  - ECS Cluster          │
        │  - ECR Repository       │
        │  - DynamoDB Tables      │
        │  - S3 Buckets           │
        └────────┬────────────────┘
                 │
        ┌────────▼──────────────┐
        │  Build Docker Image   │
        │  & Push to ECR        │
        └────────┬──────────────┘
                 │
        ┌────────▼──────────────┐
        │   Deploy to AWS       │
        │  - Backend → ECS      │
        │  - Frontend → S3      │
        └────────┬──────────────┘
                 │
        ┌────────▼──────────────┐
        │  Send Notification    │
        │  (Teams)              │
        └──────────────────────┘
```

---

## 🎯 GitHub Secrets Added

✅ **AWS_ACCESS_KEY_ID**
✅ **AWS_SECRET_ACCESS_KEY**
✅ **AWS_ACCOUNT_ID** = 279930135576
✅ **AWS_REGION** = ap-south-1
✅ **ECR_REPOSITORY_NAME** = msp-assistant-backend
✅ **S3_BUCKET_NAME** = msp-assistant-frontend-prod
✅ **TEAMS_WEBHOOK_URL** (optional)

---

## 📋 What Each Job Does

### **1. Test Job**
- Tests backend with pytest
- Tests frontend with npm
- Generates coverage reports
- **Duration:** ~5 minutes

### **2. Deploy Infrastructure Job** ⭐ NEW
- Initializes Terraform
- Plans AWS resources
- Applies Terraform configuration
- Creates/updates all AWS infrastructure
- **Duration:** ~10 minutes

### **3. Build Backend Job**
- Builds Docker image
- Tags image with git commit SHA
- Pushes to AWS ECR
- **Duration:** ~5 minutes

### **4. Deploy Backend Job**
- Updates ECS task definition
- Deploys to ECS Fargate
- Waits for service stability
- **Duration:** ~3 minutes

### **5. Deploy Frontend Job**
- Builds React application
- Syncs to S3
- Invalidates CloudFront cache
- **Duration:** ~5 minutes

### **6. Notify Job**
- Sends Teams notification
- Reports deployment status
- **Duration:** ~1 minute

---

## ✅ Watch Your First Deployment

1. **Open GitHub Actions:**
   https://github.com/Krishna-0609/msp-assistant/actions

2. **Click on the latest workflow run**
   - You should see "Deploy MSP Assistant" workflow

3. **Watch the progress:**
   - Green checkmarks = Success ✓
   - Red X = Failed ✗

4. **Each job shows:**
   - Job name
   - Duration
   - Logs (click to expand)

---

## 🔍 Troubleshooting

### **Workflow Shows "In Progress"**
- Wait for infrastructure to deploy (takes ~10-15 min)
- Check Terraform output in logs

### **Terraform Apply Fails**
1. Check AWS credentials in GitHub Secrets
2. Verify AWS_ACCOUNT_ID is correct
3. Check IAM permissions for the user

### **Docker Build Fails**
1. Check backend/requirements.txt has all dependencies
2. Verify Python version compatibility
3. Check Docker file syntax

### **ECS Deployment Fails**
1. Check ECS cluster exists (created by Terraform)
2. Verify task definition is valid
3. Check container logs in ECS console

### **Frontend Deploy Fails**
1. Check S3 bucket exists (created by Terraform)
2. Verify npm build completes successfully
3. Check frontend/dist folder has files

---

## 📊 View Deployment Results

### **AWS Console:**
- **ECS:** https://ap-south-1.console.aws.amazon.com/ecs/
- **ECR:** https://ap-south-1.console.aws.amazon.com/ecr/
- **S3:** https://s3.console.aws.amazon.com/s3/
- **DynamoDB:** https://ap-south-1.console.aws.amazon.com/dynamodb/

### **GitHub Actions:**
- **Workflow Runs:** https://github.com/Krishna-0609/msp-assistant/actions
- **Workflow File:** `.github/workflows/deploy.yml`

---

## 🔄 Next Pushes = Automatic Deployment

Every time you push to `main` or `master`:

```bash
git add .
git commit -m "Feature: your change here"
git push origin main
```

✅ Workflow runs automatically
✅ Infrastructure updated (if needed)
✅ App rebuilt and deployed
✅ Teams notification sent

---

## 📝 Monitoring Deployments

### **Real-Time Logs:**
1. Go to Actions → Workflow Run
2. Click on each job to expand logs
3. Scroll through terraform, build, deploy output

### **Check Deployment Status:**
```bash
# Backend status
aws ecs describe-services \
  --cluster msp-assistant-cluster \
  --services msp-assistant-backend-service \
  --region ap-south-1

# Frontend status
aws s3 ls s3://msp-assistant-frontend-prod/

# DynamoDB tables
aws dynamodb list-tables --region ap-south-1
```

---

## 🎉 You're All Set!

Your CI/CD pipeline is now fully automated:

✅ **Infrastructure** = Managed by Terraform
✅ **Build** = Automated Docker builds
✅ **Deploy** = Automatic ECS deployment
✅ **Notifications** = Teams alerts
✅ **Monitoring** = GitHub Actions logs

**Start using it:**
```bash
git push origin main
```

Then watch your first deployment at: https://github.com/Krishna-0609/msp-assistant/actions

---

## 📞 Need Help?

Check the workflow logs:
1. Go to Actions → Latest run
2. Click on failed job
3. Scroll to see error messages
4. Fix locally and push again

The workflow is fully idempotent - you can re-run failed jobs without issues!
