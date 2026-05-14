# ⚡ Run CI/CD Setup NOW - Quick Start

## 🚀 5-Minute Setup

You have **two deployment scripts** that do everything automatically.

---

## 💻 For Windows (PowerShell)

### Step 1: Open PowerShell as Administrator

```powershell
# Right-click PowerShell → Run as Administrator
```

### Step 2: Navigate to Project

```powershell
cd "d:\One Data Solution\AWS AI agent"
```

### Step 3: Allow Script Execution

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 4: Run the Script

```powershell
# Replace YOUR-USERNAME with your GitHub username
.\deploy-cicd.ps1 -GitHubRepo "YOUR-USERNAME/msp-assistant"

# Example:
# .\deploy-cicd.ps1 -GitHubRepo "john-doe/msp-assistant"
```

### Step 5: Wait for Completion

```
Watch the output...
[SUCCESS] ✓ ECR repository created
[SUCCESS] ✓ S3 bucket created
[SUCCESS] ✓ DynamoDB tables created
[SUCCESS] ✓ Code pushed to GitHub
[SUCCESS] === SETUP COMPLETE ===
```

---

## 🐧 For Linux/Mac (Bash)

### Step 1: Open Terminal

```bash
cd /path/to/msp-assistant
```

### Step 2: Make Script Executable

```bash
chmod +x deploy-cicd.sh
```

### Step 3: Run the Script

```bash
# Replace your-username with your GitHub username
./deploy-cicd.sh --github-repo "your-username/msp-assistant"

# Example:
# ./deploy-cicd.sh --github-repo "john-doe/msp-assistant"
```

### Step 4: Wait for Completion

Same as Windows - watch for success message.

---

## ✅ What Happens Automatically

The script does ALL this:

```
✅ Checks: AWS CLI, Git, GitHub CLI, Docker
✅ Creates: ECR repository
✅ Creates: S3 bucket
✅ Creates: 4 DynamoDB tables
✅ Configures: GitHub repository
✅ Pushes: Code to GitHub
✅ Shows: Required GitHub secrets
✅ Verifies: All resources created
```

---

## ⚠️ Important: After Script Completes

### You Must Manually Do This (5 minutes)

**Go to GitHub and add secrets:**

```
1. GitHub → Settings → Secrets and variables → Actions
2. Click: New repository secret
3. Add these 10 secrets:
```

| Name | Value | Where to Get |
|------|-------|--------------|
| **AWS_ACCESS_KEY_ID** | Your AWS access key | AWS IAM console |
| **AWS_SECRET_ACCESS_KEY** | Your AWS secret key | AWS IAM console |
| AWS_ACCOUNT_ID | Your AWS account ID | (shown during script) |
| AWS_REGION | ap-south-1 | (already set by script) |
| ECR_REPOSITORY_NAME | msp-assistant-backend | (already set by script) |
| ECS_CLUSTER_NAME | msp-assistant-cluster | (already set by script) |
| ECS_SERVICE_NAME | msp-assistant-service | (already set by script) |
| S3_BUCKET_NAME | msp-assistant-frontend-prod | (already set by script) |
| CLOUDFRONT_DISTRIBUTION_ID | [Leave for now] | (add later if needed) |
| TEAMS_WEBHOOK_URL | [Leave for now] | (add if using Teams) |

---

## 🔍 How to Get AWS Access Keys

### Step 1: Go to AWS Console

```
https://console.aws.amazon.com/iam/
```

### Step 2: Create IAM User

```
1. Click: Users
2. Click: Create user
3. Name: msp-assistant-cicd
4. Click: Next
```

### Step 3: Add Permissions

```
1. Click: Attach policies directly
2. Check: AmazonEC2ContainerRegistryPowerUser
3. Check: AmazonECS_FullAccess
4. Check: AmazonS3FullAccess
5. Check: CloudFrontFullAccess
6. Check: AmazonDynamoDBFullAccess
7. Check: CloudWatchFullAccess
8. Click: Next → Create user
```

### Step 4: Generate Access Keys

```
1. Click: Security credentials tab
2. Scroll to: Access keys
3. Click: Create access key
4. Select: Command Line Interface (CLI)
5. Copy: Access Key ID
6. Copy: Secret Access Key
```

---

## 📋 Checklist After Running Script

```
✅ Script completed without errors
✅ AWS_ACCOUNT_ID shown in output
✅ Went to GitHub repo settings
✅ Added AWS_ACCESS_KEY_ID secret
✅ Added AWS_SECRET_ACCESS_KEY secret
✅ Verified all 10 secrets added
✅ Closed GitHub secrets page
```

---

## 🎯 What's Next After Setup

### Option 1: Test Locally (5 minutes)

```bash
# Terminal 1
cd backend
python -m uvicorn app.main:app --reload

# Terminal 2
cd frontend
npm run dev

# Browser
http://localhost:3001
```

### Option 2: Deploy to AWS (30 minutes)

```bash
cd deployment/terraform
terraform init
terraform apply
```

### Option 3: Trigger CI/CD Manually (1 minute)

```bash
# Make a test commit
echo "CI/CD Test" >> TEST.txt
git add .
git commit -m "test: trigger CI/CD"
git push origin main

# Go to GitHub → Actions → Watch deployment
```

---

## 🐛 If Something Goes Wrong

### Script Error: "AWS CLI not found"

```bash
# Install AWS CLI
pip install awscli

# Then run script again
```

### Script Error: "GitHub CLI not found"

```bash
# Windows
choco install gh

# Mac
brew install gh

# Then run script again
```

### Script Error: "Permission denied" (Linux/Mac)

```bash
chmod +x deploy-cicd.sh
./deploy-cicd.sh --github-repo "your-username/msp-assistant"
```

### Script gets stuck

```bash
# Press Ctrl+C to stop
# Then re-run - script is idempotent (safe to run again)
```

---

## 📞 Quick Sanity Checks

After script completes, run these to verify:

```bash
# Check ECR created
aws ecr describe-repositories --region ap-south-1

# Check S3 created
aws s3 ls

# Check DynamoDB created
aws dynamodb list-tables --region ap-south-1

# Check GitHub repo
git remote -v
# Should show your GitHub URL
```

All should show your resources!

---

## 💡 Pro Tips

**Tip 1**: Save the output somewhere
- The script shows your AWS Account ID
- You might need it later

**Tip 2**: Keep AWS IAM page open
- Easier to get access keys

**Tip 3**: Open GitHub in another browser tab
- Ready to add secrets

**Tip 4**: The script is idempotent**
- Safe to run multiple times
- Won't create duplicates
- Won't error if run again

---

## 🎉 That's It!

**1 command → Everything set up**

```powershell
# Windows
.\deploy-cicd.ps1 -GitHubRepo "your-username/msp-assistant"

# Linux/Mac
./deploy-cicd.sh --github-repo "your-username/msp-assistant"
```

Then manually add GitHub secrets (10 values).

**Total Time: ~10-15 minutes**

---

## 📊 What Gets Created

| Resource | Type | Region | Cost |
|----------|------|--------|------|
| ECR Repo | Container Registry | ap-south-1 | Free tier |
| S3 Bucket | Storage | ap-south-1 | ~$0.23/month |
| DynamoDB (4 tables) | Database | ap-south-1 | ~$0.25/month |
| GitHub Workflow | CI/CD | N/A | Free |

**Total: ~$0.50/month (super cheap!)**

---

## 🚀 Ready?

**Choose your platform:**

### Windows Users
```powershell
.\deploy-cicd.ps1 -GitHubRepo "YOUR-USERNAME/msp-assistant"
```

### Linux/Mac Users
```bash
./deploy-cicd.sh --github-repo "your-username/msp-assistant"
```

**Then watch the magic happen! ✨**

