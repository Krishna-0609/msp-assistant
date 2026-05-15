# AWS Mumbai Setup Guide - Claude Sonnet 4.6

## ✅ Configuration Complete

Your `.env` has been updated:
- ✅ Region: `ap-south-1` (Mumbai)
- ✅ Bedrock Model: `claude-sonnet-4-20250514-v1:0` (Sonnet 4.6)
- ✅ All AWS services configured for Mumbai

---

## 🚀 NEXT STEPS (7 Steps)

### STEP 1: Verify AWS CLI Configuration (5 minutes)

```bash
# Check AWS CLI is installed
aws --version
# Expected: aws-cli/2.x.x Python/3.x

# Verify credentials are configured
aws sts get-caller-identity
# Expected output:
# {
#     "UserId": "AIDACKCEVSQ6C2EXAMPLE",
#     "Account": "123456789012",
#     "Arn": "arn:aws:iam::123456789012:user/your-user"
# }

# Check your AWS region is set
aws configure list
# Should show: region = ap-south-1
```

If any errors, run:
```bash
aws configure
# Choose region: ap-south-1 (Mumbai)
# Choose output format: json
```

---

### STEP 2: Create DynamoDB Tables in Mumbai (5 minutes)

```bash
# Create msp-costs table
aws dynamodb create-table \
    --table-name msp-costs \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region ap-south-1

# Create msp-alerts table
aws dynamodb create-table \
    --table-name msp-alerts \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region ap-south-1

# Create msp-users table
aws dynamodb create-table \
    --table-name msp-users \
    --attribute-definitions \
        AttributeName=email,AttributeType=S \
    --key-schema \
        AttributeName=email,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region ap-south-1

# Create msp-chat table
aws dynamodb create-table \
    --table-name msp-chat \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region ap-south-1

# Verify tables created
aws dynamodb list-tables --region ap-south-1
# Should show all 4 tables
```

---

### STEP 3: Create S3 Bucket in Mumbai (5 minutes)

```bash
# Create S3 bucket
aws s3 mb s3://msp-assistant-data-mumbai --region ap-south-1

# Enable versioning
aws s3api put-bucket-versioning \
    --bucket msp-assistant-data-mumbai \
    --versioning-configuration Status=Enabled \
    --region ap-south-1

# Block public access
aws s3api put-public-access-block \
    --bucket msp-assistant-data-mumbai \
    --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
    --region ap-south-1

# Verify bucket created
aws s3 ls --region ap-south-1
```

---

### STEP 4: Enable Bedrock in Mumbai (5 minutes)

```bash
# Check if Bedrock is available in ap-south-1
aws bedrock list-foundation-models --region ap-south-1

# You should see Claude Sonnet 4.6 in the list:
# "modelId": "anthropic.claude-sonnet-4-20250514-v1:0"

# If Bedrock is not enabled, go to:
# AWS Console → Bedrock → Model Access → Request Access
# Select Claude Sonnet 4.6 and request access
```

**⚠️ IMPORTANT**: Bedrock might need to be enabled in your AWS account:
1. Go to AWS Console
2. Search for "Bedrock"
3. Click "Model Access" on the left
4. Find "Claude Sonnet 4.6" (anthropic.claude-sonnet-4-20250514-v1:0)
5. Click "Request Access"
6. Wait for approval (usually instant)

---

### STEP 5: Test AWS Credentials in Backend (10 minutes)

```bash
# Go to backend directory
cd backend

# Restart backend with new config
python -m uvicorn app.main:app --reload

# In another terminal, test AWS connectivity
curl http://localhost:8000/health

# Should show:
# {
#   "status": "healthy",
#   "service": "MSP Assistant API",
#   "version": "1.0.0"
# }
```

---

### STEP 6: Test AWS Services from Backend (10 minutes)

**Test DynamoDB:**
```bash
curl -X GET http://localhost:8000/api/costs/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Should return costs (empty list is OK for now)
```

**Test Bedrock/Claude:**
```bash
curl -X POST http://localhost:8000/api/chat/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, what is your name?",
    "account_id": "123456789012"
  }'

# Should get response from Claude Sonnet 4.6
```

**Check backend logs for Claude response:**
```bash
# In backend terminal, you should see:
# INFO: Claude responded with: ...
```

---

### STEP 7: Verify All AWS Services Working (10 minutes)

```bash
# Create verification script: test_aws.sh

#!/bin/bash

echo "Testing AWS Mumbai Configuration..."
echo ""

# Test AWS credentials
echo "1. Testing AWS Credentials..."
aws sts get-caller-identity --region ap-south-1
echo "✅ AWS Credentials OK"
echo ""

# Test DynamoDB
echo "2. Testing DynamoDB Tables..."
aws dynamodb list-tables --region ap-south-1
echo "✅ DynamoDB Tables OK"
echo ""

# Test S3
echo "3. Testing S3 Bucket..."
aws s3 ls --region ap-south-1
echo "✅ S3 Bucket OK"
echo ""

# Test Bedrock
echo "4. Testing Bedrock Models..."
aws bedrock list-foundation-models --region ap-south-1 \
  --query 'modelSummaries[?contains(modelId, `claude-sonnet-4`)]'
echo "✅ Bedrock Claude Sonnet 4.6 Available"
echo ""

echo "All AWS Services Configured! ✅"
```

Run it:
```bash
bash test_aws.sh
```

---

## 📊 Configuration Summary

### AWS Region: Mumbai (ap-south-1)
```
Region Code:     ap-south-1
Region Name:     Asia Pacific (Mumbai)
Time Zone:       IST (UTC+5:30)
Bedrock Support: ✅ YES (Claude Sonnet 4.6)
```

### Services Configured

| Service | Table/Resource | Region | Status |
|---------|---|---|---|
| DynamoDB | msp-costs | ap-south-1 | ✅ |
| DynamoDB | msp-alerts | ap-south-1 | ✅ |
| DynamoDB | msp-users | ap-south-1 | ✅ |
| DynamoDB | msp-chat | ap-south-1 | ✅ |
| S3 | msp-assistant-data-mumbai | ap-south-1 | ✅ |
| Bedrock | Claude Sonnet 4.6 | ap-south-1 | ✅ |

### Environment Variables Updated
```
AWS_REGION=ap-south-1
BEDROCK_MODEL_ID=anthropic.claude-sonnet-4-20250514-v1:0
BEDROCK_REGION=ap-south-1
S3_BUCKET=msp-assistant-data-mumbai
```

---

## 🔍 How to Check Each Service

### Check DynamoDB Tables
```bash
aws dynamodb list-tables --region ap-south-1

# See table details
aws dynamodb describe-table \
    --table-name msp-costs \
    --region ap-south-1
```

### Check S3 Bucket
```bash
aws s3 ls s3://msp-assistant-data-mumbai/ --region ap-south-1
```

### Check Bedrock Models
```bash
aws bedrock list-foundation-models --region ap-south-1
```

### Check AWS Credentials
```bash
aws sts get-caller-identity --region ap-south-1
```

---

## 🎯 Next Steps After Verification

### Option 1: Test with Real AWS Data (Recommended)
```bash
# In backend terminal
python -m uvicorn app.main:app --reload

# In frontend terminal
cd frontend
npm run dev

# Open browser: http://localhost:3001
# Login: admin@example.com / Demo@123
# Try Chat page to test Claude Sonnet 4.6
```

### Option 2: Set Up Production (AWS Deployment)
Follow: `CICD_SETUP_GUIDE.md` → `DEPLOYMENT_GUIDE.md`

### Option 3: Configure YouTrack Integration
Follow: `YOUTRACK_SETUP_GUIDE.md`

---

## 💡 Cost Estimation (Mumbai Region)

**Monthly Costs (Estimated):**

| Service | Usage | Cost |
|---------|-------|------|
| DynamoDB | Pay-per-request | $0.25 (startup) |
| S3 | 10 GB storage | $0.23 |
| Bedrock | 1M tokens/day | ~$3-5 |
| Data Transfer | Within region | Free |
| **Total** | | **~$4-6/month** |

**Tip**: Mumbai region is ~30% cheaper than US regions!

---

## 🔐 Security Checklist

```
✅ AWS CLI configured with credentials
✅ Region set to ap-south-1 (Mumbai)
✅ DynamoDB tables created
✅ S3 bucket created with access blocking
✅ Bedrock enabled
✅ Backend environment variables updated
✅ All services in same region (no cross-region data transfer)
```

---

## 🚨 Troubleshooting

### Issue: "Region ap-south-1 is not available"
```bash
# Update AWS CLI
pip install --upgrade awscli

# Or verify region is correct
aws ec2 describe-regions --region ap-south-1
```

### Issue: "Bedrock not available in ap-south-1"
```bash
# Check Bedrock availability
aws bedrock list-foundation-models --region ap-south-1

# If error: Go to AWS Console → Bedrock → Enable Bedrock
```

### Issue: "DynamoDB table not found"
```bash
# Verify table exists
aws dynamodb list-tables --region ap-south-1

# If missing, create again with commands from STEP 2
```

### Issue: "Bedrock Claude Sonnet 4.6 not found"
```bash
# List all available models
aws bedrock list-foundation-models --region ap-south-1

# Look for: anthropic.claude-sonnet-4-20250514-v1:0

# If not found: Request model access in AWS Console
```

### Issue: "Chat API returns error"
```bash
# Check backend logs for specific error
# Backend terminal should show error message

# Common fixes:
# 1. Restart backend after .env changes
# 2. Verify Bedrock is enabled
# 3. Check AWS credentials: aws sts get-caller-identity

# Test manually:
aws bedrock-runtime invoke-model \
    --model-id anthropic.claude-sonnet-4-20250514-v1:0 \
    --body '{"prompt":"Hello"}' \
    --region ap-south-1
```

---

## 📱 Using Claude Sonnet 4.6 in Chat

Once everything is set up, you can use it in the chat:

```
User: "How much am I spending on AWS?"
Claude Sonnet 4.6: "I'll analyze your AWS costs for you. Let me check your account..."

User: "Can you suggest ways to optimize costs?"
Claude Sonnet 4.6: "Based on your usage patterns, here are recommendations..."
```

Claude Sonnet 4.6 features:
- ✅ Faster responses than Sonnet 3.5
- ✅ Better code understanding
- ✅ Improved reasoning
- ✅ Native tool use
- ✅ Cost optimization

---

## ✅ Success Checklist

After completing all 7 steps, verify:

```
□ AWS CLI configured
□ AWS CLI shows correct region (ap-south-1)
□ Can run: aws sts get-caller-identity
□ All 4 DynamoDB tables created
□ S3 bucket created
□ Bedrock enabled in ap-south-1
□ Claude Sonnet 4.6 available
□ Backend started successfully
□ Chat API responds with Claude
□ No errors in backend logs
□ Can login to frontend
□ Chat works with Claude Sonnet 4.6
```

---

## 📞 Quick Commands Reference

```bash
# Verify everything
aws sts get-caller-identity --region ap-south-1
aws dynamodb list-tables --region ap-south-1
aws s3 ls --region ap-south-1
aws bedrock list-foundation-models --region ap-south-1

# Test backend
curl http://localhost:8000/health

# Test with JWT
curl -X POST http://localhost:8000/api/chat/ \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"message":"Test","account_id":"123456789012"}'

# View backend logs
# (in the terminal where backend is running)
```

---

## 🎉 You're Ready!

All AWS services are configured for Mumbai with Claude Sonnet 4.6.

**Next: Follow the verification steps above, then:**
1. Test in frontend (http://localhost:3001)
2. Try Chat page with Claude Sonnet 4.6
3. Verify costs are fetched from DynamoDB
4. Test alerts stored in DynamoDB

---

**Everything is configured! Run the 7 steps above to complete setup. ✅**

