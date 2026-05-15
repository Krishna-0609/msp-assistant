# ⚡ Immediate Next Steps - AWS Mumbai Setup

## ✅ What Just Changed

Your `.env` has been updated:
```
✅ AWS_REGION = ap-south-1 (Mumbai)
✅ BEDROCK_MODEL_ID = claude-sonnet-4-20250514-v1:0 (Sonnet 4.6)
✅ BEDROCK_REGION = ap-south-1 (Mumbai)
✅ S3_BUCKET = msp-assistant-data
```

---

## 🚀 Your 7-Step Checklist (45 Minutes Total)

### ✅ STEP 1: Verify AWS CLI (5 min)

```bash
# Run this
aws sts get-caller-identity

# You should see your AWS account info
# If error → Run: aws configure
#           Choose region: ap-south-1
```

### ✅ STEP 2: Create DynamoDB Tables (5 min)

Copy & paste this in PowerShell:

```powershell
# Run all 4 commands
aws dynamodb create-table --table-name msp-costs --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --billing-mode PAY_PER_REQUEST --region ap-south-1

aws dynamodb create-table --table-name msp-alerts --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --billing-mode PAY_PER_REQUEST --region ap-south-1

aws dynamodb create-table --table-name msp-users --attribute-definitions AttributeName=email,AttributeType=S --key-schema AttributeName=email,KeyType=HASH --billing-mode PAY_PER_REQUEST --region ap-south-1

aws dynamodb create-table --table-name msp-chat --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --billing-mode PAY_PER_REQUEST --region ap-south-1

# Verify all 4 tables created
aws dynamodb list-tables --region ap-south-1
```

### ✅ STEP 3: Create S3 Bucket (5 min)

```powershell
# Create bucket
aws s3 mb s3://msp-assistant-data-mumbai --region ap-south-1

# Enable versioning
aws s3api put-bucket-versioning --bucket msp-assistant-data-mumbai --versioning-configuration Status=Enabled --region ap-south-1

# Block public access
aws s3api put-public-access-block --bucket msp-assistant-data-mumbai --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" --region ap-south-1

# Verify bucket created
aws s3 ls --region ap-south-1
```

### ✅ STEP 4: Enable Bedrock Claude Sonnet 4.6 (5 min)

**Option A: Via AWS Console (Fastest)**
1. Go to: https://console.aws.amazon.com/bedrock/
2. Click "Model Access" (left sidebar)
3. Find "Claude Sonnet 4.6" or search "anthropic.claude-sonnet-4"
4. If not enabled: Click "Request Access" → Confirm
5. Wait ~1 minute for approval (usually instant)

**Option B: Verify via CLI**
```powershell
aws bedrock list-foundation-models --region ap-south-1

# Look for "anthropic.claude-sonnet-4" in the output
```

### ✅ STEP 5: Restart Backend (5 min)

**Terminal 1: Stop Backend**
```bash
# Press Ctrl+C in the terminal where backend is running
# You should see: Shutting down...
```

**Terminal 1: Start Backend Again**
```bash
cd backend
python -m uvicorn app.main:app --reload

# You should see:
# INFO: Application startup complete
# INFO: Uvicorn running on http://127.0.0.1:8000
```

### ✅ STEP 6: Test Backend Health (5 min)

**Terminal 3 (New): Test Connection**
```bash
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","service":"MSP Assistant API","version":"1.0.0"}
```

### ✅ STEP 7: Test Chat with Claude Sonnet 4.6 (10 min)

**First: Get JWT Token**
```bash
# Login to get token
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Demo@123"}'

# Copy the "access_token" value from response
```

**Then: Test Chat**
```bash
# Replace YOUR_JWT_TOKEN with token from above
curl -X POST http://localhost:8000/api/chat/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, what is your name?",
    "account_id": "123456789012"
  }'

# You should get response from Claude Sonnet 4.6
```

---

## ✅ Verification Checklist

After each step, mark it:

```
STEP 1: AWS CLI Verification
□ Can run: aws sts get-caller-identity
□ Shows correct AWS account
□ Shows correct region (ap-south-1)

STEP 2: DynamoDB Tables
□ msp-costs table created
□ msp-alerts table created
□ msp-users table created
□ msp-chat table created

STEP 3: S3 Bucket
□ Bucket created: msp-assistant-data-mumbai
□ Versioning enabled
□ Public access blocked

STEP 4: Bedrock
□ Claude Sonnet 4.6 available
□ Model ID: anthropic.claude-sonnet-4-20250514-v1:0
□ Region: ap-south-1

STEP 5: Backend Restart
□ Backend started successfully
□ No errors in logs
□ Running on port 8000

STEP 6: Backend Health
□ Health check returns 200 OK
□ Response shows "healthy"

STEP 7: Chat Test
□ Got JWT token
□ Chat API responds
□ Response from Claude Sonnet 4.6
□ No errors in logs
```

---

## 🎯 If You Get Errors

### Error: "Access Denied" or "UnauthorizedException"
```bash
# Your AWS credentials aren't configured
# Run:
aws configure

# When prompted:
# AWS Access Key ID: [paste your access key]
# AWS Secret Access Key: [paste your secret key]
# Default region name: ap-south-1
# Default output format: json
```

### Error: "Bedrock is not available in region ap-south-1"
```bash
# Go to AWS Console:
# 1. Search: "Bedrock"
# 2. Click: "Model Access"
# 3. Find: "Claude Sonnet 4.6"
# 4. Click: "Request Access"
# 5. Wait 1-2 minutes
```

### Error: "Unable to locate credentials"
```bash
# Your AWS CLI isn't configured
# Run:
aws configure list

# If no region shows, run:
aws configure
```

### Error: "Table already exists"
```bash
# Tables already created (that's fine!)
# Just continue to next step
```

### Error: "Chat API returns error"
```bash
# Check backend logs for the actual error
# Most likely causes:
# 1. Bedrock not enabled
# 2. Backend not restarted after .env update
# 3. JWT token is invalid

# Fix:
# 1. Verify Bedrock is enabled in AWS Console
# 2. Stop backend (Ctrl+C) and restart
# 3. Get new JWT token and try again
```

---

## 📊 What Happens After Setup

```
Step 1-7: Configuration ✅
         ↓
Step 8: Login to Frontend (http://localhost:3001)
        admin@example.com / Demo@123
         ↓
Step 9: Chat with Claude Sonnet 4.6
        "How much am I spending?"
         ↓
Step 10: View Dashboard with real AWS data
         Costs from DynamoDB (or mock if new)
         ↓
SUCCESS! System is working with AWS Mumbai + Claude Sonnet 4.6
```

---

## 💡 Pro Tips

**Tip 1: Keep AWS Console Open**
- Keep AWS Console tab open in browser
- Useful for checking tables, buckets, Bedrock status

**Tip 2: Multiple Terminals**
- Terminal 1: Backend
- Terminal 2: Frontend
- Terminal 3: AWS CLI commands

**Tip 3: Copy Commands**
- All commands are provided above
- Just copy & paste into PowerShell

**Tip 4: Be Patient with Bedrock**
- Bedrock model access usually takes 1-2 minutes
- If stuck, refresh AWS Console and try again

---

## 🔍 How to Monitor Progress

**Terminal 1 (Backend Logs)**
```
[shows API requests and Claude responses]
INFO: POST /api/chat/ 
INFO: Claude responded with: "Hello, I am Claude..."
```

**Terminal 2 (Frontend)**
```
VITE v5.4.21 ready in 359 ms
➜  Local:   http://localhost:3001/
```

**Terminal 3 (AWS CLI)**
```
[shows AWS commands and responses]
```

---

## ✨ Final Check: Everything Working?

Open in browser:
```
Frontend: http://localhost:3001
Login: admin@example.com / Demo@123
Click: Chat
Type: "Hello"
Response: Claude Sonnet 4.6 replies ✅
```

If you see Claude's response → **Everything is working!** 🎉

---

## 📞 Quick Reference

| What | Command |
|------|---------|
| Check AWS | `aws sts get-caller-identity --region ap-south-1` |
| List DynamoDB tables | `aws dynamodb list-tables --region ap-south-1` |
| List S3 buckets | `aws s3 ls --region ap-south-1` |
| Check Bedrock | `aws bedrock list-foundation-models --region ap-south-1` |
| Health check | `curl http://localhost:8000/health` |
| Get JWT | `curl -X POST http://localhost:8000/api/auth/login ...` |
| Test Chat | `curl -X POST http://localhost:8000/api/chat/ ...` |

---

## 🎯 Total Time: ~45 Minutes

1. Verify AWS CLI - 5 min
2. Create DynamoDB - 5 min
3. Create S3 - 5 min
4. Enable Bedrock - 5 min
5. Restart Backend - 5 min
6. Test Backend - 5 min
7. Test Chat - 10 min

**→ Total: 45 minutes to full production setup!**

---

## 🚀 Next After This?

Once all 7 steps are done:

**Option A: Deploy to Production** (2-3 hours)
- Follow: `CICD_SETUP_GUIDE.md`
- Deploy to AWS ECS Fargate

**Option B: Set Up YouTrack** (20 minutes)
- Follow: `YOUTRACK_SETUP_GUIDE.md`
- Automatic ticket creation from alerts

**Option C: Test Everything** (30 minutes)
- Follow: `LOCAL_TESTING_GUIDE.md`
- Test all 94 features locally

**Option D: Just Start Using It!** ✅
- Login to http://localhost:3001
- Chat with Claude Sonnet 4.6
- View costs, alerts, reports
- Have fun!

---

## 🎉 Ready? Let's Go!

Start with STEP 1 above and work your way through.

You have:
- ✅ AWS credentials configured
- ✅ Updated .env with Mumbai + Sonnet 4.6
- ✅ All commands ready to paste
- ✅ This checklist to track progress

**Let's get started! 🚀**

