# Automated Deployment Script Guide

## 🚀 Overview

Two fully idempotent deployment scripts are provided:

- **`deploy-cicd.ps1`** - PowerShell version (Windows)
- **`deploy-cicd.sh`** - Bash version (Linux/Mac)

**What is Idempotent?**
- Safe to run multiple times
- Won't duplicate resources
- Will skip already-created items
- No errors if run again

---

## ⚙️ What the Script Does

The script automates ALL these steps:

```
✅ Checks prerequisites (AWS CLI, Git, GitHub CLI, Docker)
✅ Creates ECR repository (if doesn't exist)
✅ Creates S3 bucket (if doesn't exist)
✅ Creates DynamoDB tables (if don't exist)
✅ Configures GitHub repository
✅ Pushes code to GitHub
✅ Shows required GitHub secrets
✅ Verifies all resources created
✅ Shows next steps
```

**Time Saved**: ~2 hours of manual work → 5 minutes automated

---

## 📋 Prerequisites

Before running the script, make sure you have:

```
✅ AWS Account with credentials configured
✅ GitHub Account
✅ AWS CLI installed
✅ Git installed
✅ GitHub CLI (gh) installed
✅ Docker installed
```

### Quick Check

```bash
# Windows (PowerShell)
aws --version
git --version
gh --version
docker --version

# Linux/Mac
aws --version
git --version
gh --version
docker --version
```

If any are missing, install them first.

---

## 🔧 Setup Instructions

### For Windows (PowerShell)

#### Step 1: Make Script Executable

```powershell
# Open PowerShell as Administrator

# Navigate to project
cd "d:\One Data Solution\AWS AI agent"

# Allow script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Step 2: Run the Script

```powershell
# Basic usage (will prompt for GitHub repo)
.\deploy-cicd.ps1

# With parameters
.\deploy-cicd.ps1 -GitHubRepo "your-username/msp-assistant"

# With all parameters
.\deploy-cicd.ps1 `
    -GitHubRepo "your-username/msp-assistant" `
    -AwsRegion "ap-south-1" `
    -AwsProfile "default"
```

#### Step 3: Wait for Completion

```
[INFO] Checking AWS CLI...
[SUCCESS] ✓ AWS CLI found
[INFO] Checking Git...
[SUCCESS] ✓ Git found
...
[SUCCESS] === SETUP COMPLETE ===
```

---

### For Linux/Mac (Bash)

#### Step 1: Make Script Executable

```bash
# Navigate to project
cd "path/to/msp-assistant"

# Make script executable
chmod +x deploy-cicd.sh
```

#### Step 2: Run the Script

```bash
# Basic usage
./deploy-cicd.sh

# With parameters
./deploy-cicd.sh --github-repo "your-username/msp-assistant"

# With all parameters
./deploy-cicd.sh \
    --github-repo "your-username/msp-assistant" \
    --aws-region "ap-south-1" \
    --aws-profile "default"
```

#### Step 3: Wait for Completion

Same as Windows - watch for completion message.

---

## 📖 Script Output Explained

### What You'll See

```
[INFO] Checking prerequisites...
[SUCCESS] ✓ AWS CLI found
[SUCCESS] ✓ Git found
[SUCCESS] ✓ GitHub CLI found
[SUCCESS] ✓ Docker found
[SUCCESS] ✓ AWS credentials valid (Account: 123456789012)
[SUCCESS] All prerequisites met

=== SETTING UP ECR ===
[INFO] Creating ECR repository: msp-assistant-backend
[SUCCESS] ✓ ECR repository created

=== SETTING UP S3 ===
[INFO] Creating S3 bucket: msp-assistant-frontend-prod
[SUCCESS] ✓ S3 bucket created
[INFO] Enabling S3 versioning
[SUCCESS] ✓ S3 versioning enabled
[INFO] Blocking public access
[SUCCESS] ✓ S3 public access blocked

=== SETTING UP DYNAMODB ===
[INFO] Creating DynamoDB table: msp-costs
[SUCCESS] ✓ DynamoDB table created: msp-costs
[INFO] Creating DynamoDB table: msp-alerts
[SUCCESS] ✓ DynamoDB table created: msp-alerts
[INFO] Creating DynamoDB table: msp-users
[SUCCESS] ✓ DynamoDB table created: msp-users
[INFO] Creating DynamoDB table: msp-chat
[SUCCESS] ✓ DynamoDB table created: msp-chat

=== SETTING UP GITHUB REPOSITORY ===
[INFO] Configuring Git repository: your-username/msp-assistant
[SUCCESS] ✓ Git repository configured
[INFO] Pushing code to GitHub
[SUCCESS] ✓ Code pushed to GitHub

=== SETTING UP GITHUB SECRETS ===
[WARNING] Note: Manual secrets setup required

To complete GitHub secrets setup:
1. Go to: https://github.com/your-username/msp-assistant/settings/secrets/actions
2. Add these secrets:
   AWS_ACCESS_KEY_ID = [MANUAL: Enter your access key]
   AWS_SECRET_ACCESS_KEY = [MANUAL: Enter your secret key]
   AWS_ACCOUNT_ID = 123456789012
   AWS_REGION = ap-south-1
   ECR_REPOSITORY_NAME = msp-assistant-backend
   ECS_CLUSTER_NAME = msp-assistant-cluster
   ECS_SERVICE_NAME = msp-assistant-service
   S3_BUCKET_NAME = msp-assistant-frontend-prod
   CLOUDFRONT_DISTRIBUTION_ID = [MANUAL: Enter later]
   TEAMS_WEBHOOK_URL = [MANUAL: Enter if using Teams]

=== VERIFYING SETUP ===
[INFO] Verifying ECR
[SUCCESS] ✓ ECR verified
[INFO] Verifying S3
[SUCCESS] ✓ S3 verified
[INFO] Verifying DynamoDB
[SUCCESS] ✓ All DynamoDB tables verified

=== SETUP COMPLETE ===

Next Steps:
1. Add GitHub Secrets (see above):
   AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from IAM user

2. Configure GitHub Actions workflow:
   File: .github/workflows/deploy.yml

3. Deploy infrastructure with Terraform:
   cd deployment/terraform
   terraform init
   terraform apply

4. Push code to trigger CI/CD:
   git push origin main

5. Monitor deployment:
   GitHub → Actions → Watch workflow
```

---

## ✅ Color-Coded Status Messages

| Color | Meaning | Action |
|-------|---------|--------|
| 🟢 GREEN | Success | All good, continue |
| 🔴 RED | Error | Fix the issue |
| 🟡 YELLOW | Warning | Information, not critical |
| 🔵 BLUE | Info | Informational |

---

## 🔄 Idempotency Examples

### Example 1: Run Script Twice

```bash
# First run
./deploy-cicd.sh --github-repo "user/repo"
# Creates everything successfully

# Second run (safe to run again)
./deploy-cicd.sh --github-repo "user/repo"
# Skips already-created resources:
[WARNING] ECR repository already exists
[WARNING] S3 bucket already exists
[WARNING] DynamoDB table already exists: msp-costs
...
# No errors, no duplicates
```

### Example 2: Run After Manual Deletion

```bash
# If you deleted S3 bucket manually
aws s3 rb s3://msp-assistant-frontend-prod

# Re-run script
./deploy-cicd.sh --github-repo "user/repo"
# Detects missing bucket and recreates it
[INFO] Creating S3 bucket: msp-assistant-frontend-prod
[SUCCESS] ✓ S3 bucket created
```

---

## 🔧 Common Scenarios

### Scenario 1: First-Time Setup

```bash
./deploy-cicd.sh --github-repo "myusername/msp-assistant"

# Script creates everything and shows next steps
```

### Scenario 2: Re-run with Same Repository

```bash
# Safe to run multiple times on same repo
./deploy-cicd.sh --github-repo "myusername/msp-assistant"

# Skips already-created items
# Won't cause duplicates or errors
```

### Scenario 3: Different AWS Region

```bash
# Use different region
./deploy-cicd.ps1 -GitHubRepo "user/repo" -AwsRegion "us-east-1"

# Creates resources in new region
# Previous region resources untouched
```

### Scenario 4: Different AWS Profile

```bash
# Use different AWS profile
./deploy-cicd.ps1 `
    -GitHubRepo "user/repo" `
    -AwsProfile "production"

# Uses 'production' profile credentials
```

---

## ⚠️ Troubleshooting

### Issue: "AWS CLI not found"

```bash
# Windows
pip install awscli

# Linux/Mac
brew install awscli
# or
pip install awscli
```

### Issue: "GitHub CLI not found"

```bash
# Windows
choco install gh

# Linux
sudo apt-get install gh

# Mac
brew install gh
```

### Issue: "Permission denied" (on Linux/Mac)

```bash
chmod +x deploy-cicd.sh
./deploy-cicd.sh
```

### Issue: "AWS credentials not found"

```bash
# Configure AWS CLI
aws configure

# Then run script
./deploy-cicd.sh
```

### Issue: "GitHub repository not found"

```bash
# Make sure format is: USERNAME/REPO-NAME
# Correct: myusername/msp-assistant
# Wrong: msp-assistant (missing username)

./deploy-cicd.sh --github-repo "myusername/msp-assistant"
```

### Issue: Script exits with error

```bash
# The script is idempotent, safe to re-run
./deploy-cicd.sh --github-repo "user/repo"

# It will skip the failed step and continue
```

---

## 📊 What Resources Get Created

### ECR
```
Repository: msp-assistant-backend
Region: ap-south-1 (or specified region)
Access: Private (secured)
Status: Ready for Docker images
```

### S3
```
Bucket: msp-assistant-frontend-prod
Region: ap-south-1 (or specified region)
Versioning: Enabled
Public Access: Blocked
Status: Ready for frontend files
```

### DynamoDB Tables
```
1. msp-costs
   Key: id (String)
   Billing: Pay-per-request
   
2. msp-alerts
   Key: id (String)
   Billing: Pay-per-request
   
3. msp-users
   Key: email (String)
   Billing: Pay-per-request
   
4. msp-chat
   Key: id (String)
   Billing: Pay-per-request
```

### GitHub
```
Repository: Configured with origin remote
Code: Pushed to main branch
Secrets: Instructions provided
Workflow: .github/workflows/deploy.yml
```

---

## 🎯 After Script Completes

### Immediate (Next 5 minutes)

1. **Add GitHub Secrets**
   ```
   Go to GitHub → Settings → Secrets → Actions
   Add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
   ```

2. **Verify Resources**
   ```bash
   # Check ECR
   aws ecr describe-repositories
   
   # Check S3
   aws s3 ls
   
   # Check DynamoDB
   aws dynamodb list-tables
   ```

### Short Term (Next 30 minutes)

1. **Deploy Infrastructure**
   ```bash
   cd deployment/terraform
   terraform init
   terraform apply
   ```

2. **Push Code to Trigger CI/CD**
   ```bash
   git push origin main
   ```

3. **Monitor Deployment**
   ```
   Go to GitHub → Actions → Watch workflow
   ```

---

## 📝 Script Parameters

### PowerShell

```powershell
.\deploy-cicd.ps1 `
    -GitHubRepo "username/repo"           # GitHub repo
    -AwsRegion "ap-south-1"               # AWS region
    -AwsProfile "default"                 # AWS profile
```

### Bash

```bash
./deploy-cicd.sh \
    --github-repo "username/repo"         # GitHub repo
    --aws-region "ap-south-1"             # AWS region
    --aws-profile "default"               # AWS profile
```

---

## 🔐 Security Notes

1. **Credentials**: Script never stores AWS keys
2. **Secrets**: Must be added manually to GitHub
3. **S3 Bucket**: Public access automatically blocked
4. **IAM**: Uses existing AWS CLI credentials
5. **Git**: Uses existing GitHub CLI authentication

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| **Run script (Windows)** | `.\deploy-cicd.ps1 -GitHubRepo "user/repo"` |
| **Run script (Linux/Mac)** | `./deploy-cicd.sh --github-repo "user/repo"` |
| **Check ECR** | `aws ecr describe-repositories` |
| **Check S3** | `aws s3 ls` |
| **Check DynamoDB** | `aws dynamodb list-tables` |
| **Check GitHub secrets** | Go to GitHub Settings → Secrets |

---

## ✨ Summary

**Before Script**: 2 hours of manual setup
**After Script**: 5 minutes automated + 5 minutes manual secrets

**Script does:**
- ✅ Checks all prerequisites
- ✅ Creates AWS resources
- ✅ Configures GitHub
- ✅ Fully idempotent
- ✅ Error-free

**You do:**
- ⚙️ Add GitHub secrets (10 values)
- ⚙️ Run Terraform for infrastructure
- ⚙️ Monitor first deployment

---

## 🚀 Ready?

1. Choose your script: **deploy-cicd.ps1** (Windows) or **deploy-cicd.sh** (Linux/Mac)
2. Run it with your GitHub repo: `./deploy-cicd.ps1 -GitHubRepo "username/msp-assistant"`
3. Follow the output instructions
4. Sit back and watch it work! ✨

**Everything is automated. One command. Done!** 🎉

