# Local Testing Guide - How to Test All Functionality

## 🚀 Quick Start (60 Seconds)

```bash
# Terminal 1: Start Backend
cd backend
python -m uvicorn app.main:app --reload

# Terminal 2: Start Frontend
cd frontend
npm run dev

# Open browser to: http://localhost:3001
# Login: admin@example.com / Demo@123
```

---

## ✅ Checklist: Testing All 94 Features Locally

### 1️⃣ AUTHENTICATION (5 Features)

#### Test: User Login
1. Open http://localhost:3001
2. You should see login page
3. Enter email: `admin@example.com`
4. Enter password: `Demo@123`
5. Click "Login"
6. ✅ You should be redirected to dashboard

**What to look for:**
- Login page loads without errors
- Form fields accept input
- Error message if wrong credentials
- Success: Token in browser storage

**Check token:**
```javascript
// Open browser console (F12)
localStorage.getItem('access_token')
// Should return a long string (JWT token)
```

#### Test: Protected Routes
1. Logged in? Log out (if logout button exists)
2. Try to access: http://localhost:3001/dashboard
3. ✅ Should redirect to login page

#### Test: Token Expiration (Optional)
```javascript
// In browser console
localStorage.removeItem('access_token')
// Try to refresh page
// Should redirect to login
```

---

### 2️⃣ COST MANAGEMENT (7 Features)

#### Test 1: Fetch Costs
1. Login and go to Dashboard
2. ✅ Should see "Total Cost" card: $5,625
3. ✅ Should see "Services Count" card
4. Check browser console (F12)
5. ✅ No red errors

**API Endpoint to Test:**
```bash
# Terminal
curl http://localhost:8000/api/costs/ \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should return list of costs
```

#### Test 2: Cost Summary
1. On Dashboard page
2. ✅ Should see:
   - Total Cost: $5,625
   - Highest Cost Service: EC2
   - Potential Savings: $520
   - Services Count: 3

#### Test 3: Costs Page Detail
1. Click "Costs" in navigation
2. ✅ Should see table with columns:
   - Service name (EC2, S3, Lambda, RDS)
   - Amount ($)
   - Date
   - Region
3. ✅ Should show 4 services

#### Test 4: Cost Analysis
1. Click "Analyze" button or see recommendations
2. ✅ Should show recommendations:
   - Reserved Instances (Save $400)
   - Idle Resources (Save $120)
   - Storage Optimization (Save $150)

#### Test 5: Cost Trends (Optional)
```bash
# Test API endpoint
curl http://localhost:8000/api/costs/trend \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should return 30-day trend data
```

#### Test 6: Cost Export (Optional - Future)
1. Look for "Export" button
2. Should be able to download as CSV/PDF

#### Test 7: Anomaly Detection (Optional)
```bash
# Test API endpoint
curl -X POST http://localhost:8000/api/costs/anomalies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"account_id":"123456789012","threshold_percent":30}'

# Should return anomalies if found
```

---

### 3️⃣ MONITORING & ALERTS (5 Features)

#### Test 1: View Alerts
1. Click "Alerts" in navigation
2. ✅ Should see alert list:
   - Alert ID
   - Type (cost_spike, vulnerability, performance)
   - Severity (CRITICAL, HIGH, MEDIUM, LOW)
   - Message
   - Time/Date

#### Test 2: Filter by Severity
1. On Alerts page
2. Look for filter options
3. ✅ Should be able to filter by severity
4. Select "CRITICAL" → See only critical alerts

#### Test 3: Mark as Read/Unread
1. Click on an alert
2. ✅ Should show alert details
3. ✅ Should have "Mark as Read" button
4. Click it
5. ✅ Alert should be marked

#### Test 4: Alert Details
1. Click on any alert
2. ✅ Should see details:
   - Alert type
   - Severity level
   - Full message
   - Timestamp
   - Service affected
   - Metadata

#### Test 5: Critical Alerts Endpoint (Optional)
```bash
# Test API endpoint for critical alerts
curl http://localhost:8000/api/alerts/severity/critical \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should return only CRITICAL severity alerts
```

---

### 4️⃣ NOTIFICATIONS (5 Features)

#### Test 1: Teams Webhook Configuration
1. Go to http://localhost:8000/docs (Swagger UI)
2. Look for `/api/webhooks/config` endpoint
3. ✅ Should show Teams/Slack configuration status
4. Should show: Webhook URL (sanitized if configured)

**Testing with Swagger UI:**
```
1. Open: http://localhost:8000/docs
2. Find: GET /api/webhooks/config
3. Click "Try it out"
4. Click "Execute"
5. ✅ Should return:
   {
     "teams": {
       "configured": true/false,
       "url": "https://outlook.webhook.office.com/webhookb2/..."
     },
     "slack": {
       "configured": false,
       "url": null
     }
   }
```

#### Test 2: Test Webhook
```bash
# Terminal
curl -X POST http://localhost:8000/api/webhooks/test \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should return:
# {
#   "teams": {"configured": false, "status": "webhook URL not configured"},
#   "slack": {"configured": false, "status": "webhook URL not configured"}
# }

# If you have Teams webhook configured in .env:
# Should return: {"teams": {"configured": true, "status": "success"}}
```

#### Test 3: Webhook Setup Documentation
```bash
# Terminal
curl http://localhost:8000/api/webhooks/docs

# Should return setup instructions for Teams and Slack
```

#### Test 4: Alert Formatting (With Real Webhook)
If you have Teams webhook configured:
1. Trigger an alert somehow
2. ✅ Should appear in Teams as formatted message:
   - Red/Orange/Yellow/Green color by severity
   - Alert type (COST_SPIKE, VULNERABILITY, etc.)
   - Service name
   - Message
   - Time
   - View button

#### Test 5: Slack Integration (Future)
- Add Slack webhook URL to .env
- Test same as Teams

---

### 5️⃣ AI CHAT ASSISTANT (5 Features)

#### Test 1: Chat Page Loads
1. Click "Chat" in navigation
2. ✅ Should see:
   - Message input box
   - Send button
   - Chat history area
   - Quick action buttons (if any)

#### Test 2: Send Message
1. Click chat input box
2. Type: "Hello"
3. Click Send or press Enter
4. ✅ Should see:
   - Your message appears
   - AI response appears after 2-3 seconds
   - Message appears in chat history

#### Test 3: Multiple Messages
1. Send: "How much do I spend on EC2?"
2. ✅ Should get response mentioning costs
3. Send: "How to save money?"
4. ✅ Should get recommendations
5. ✅ Conversation history shows all messages

#### Test 4: Conversation Persistence (Optional)
1. Send few messages
2. Refresh page (F5)
3. ✅ Chat history should still be there

#### Test 5: API Test
```bash
# Terminal
curl -X POST http://localhost:8000/api/chat/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Tell me about AWS costs","account_id":"123456789012"}'

# Should return AI response
```

---

### 6️⃣ REPORTS (7 Features)

#### Test 1: View Reports Page
1. Click "Reports" in navigation
2. ✅ Should see:
   - List of past reports (if any)
   - Generate report buttons/options
   - Report types: Cost, Security, Performance

#### Test 2: Generate Cost Report
1. Click "Generate Cost Report" or similar button
2. ✅ Should show report generation screen
3. Select date range (if available)
4. Click "Generate"
5. ✅ Report should appear after 2-5 seconds

#### Test 3: View Report Details
1. Generated report should show:
   - Total costs
   - Breakdown by service
   - Trends
   - Recommendations
   - Date generated

#### Test 4: Download Report (If Implemented)
1. On report page
2. Look for "Download" button
3. Click it
4. ✅ PDF or CSV should download

#### Test 5: Report Types
1. Try to generate different report types:
   - Cost Report ✓
   - Security Report ✓
   - Performance Report ✓

#### Test 6: Share Report (If Implemented)
1. On report page
2. Look for "Share" button
3. Should be able to send to email

#### Test 7: Report API
```bash
# Get all reports
curl http://localhost:8000/api/reports/ \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should return list of reports
```

---

### 7️⃣ ACCOUNT MANAGEMENT (6 Features)

#### Test 1: View Accounts
1. Click "Admin" in navigation
2. Look for "AWS Accounts" section
3. ✅ Should see list of accounts:
   - Account ID
   - Account name
   - Region
   - Status

#### Test 2: Account List (Should show 3 Demo Accounts)
✅ Should see:
- Production: acct-prod
- Development: acct-dev
- Staging: acct-stage

#### Test 3: Add Account (If enabled)
1. Look for "Add Account" button
2. Click it
3. ✅ Should show form with:
   - Account ID field
   - Account name field
   - AWS region dropdown
4. Fill in details
5. Click "Add"
6. ✅ Account should appear in list

#### Test 4: Account Details
1. Click on an account
2. ✅ Should show:
   - Full account details
   - Connection status
   - Recent activity

#### Test 5: Test Connection
1. Select an account
2. Look for "Test Connection" button
3. Click it
4. ✅ Should show:
   - "Testing connection..."
   - Then "✓ Connected" or "✗ Failed"

#### Test 6: API Test
```bash
# Get all accounts
curl http://localhost:8000/api/accounts/ \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should return list of accounts
```

---

### 8️⃣ USER INTERFACE (8 Features)

#### Test 1: All Pages Load
1. ✅ Login page - loads
2. ✅ Dashboard page - loads
3. ✅ Costs page - loads
4. ✅ Alerts page - loads
5. ✅ Chat page - loads
6. ✅ Reports page - loads
7. ✅ Admin page - loads

#### Test 2: Navigation Works
1. Click on each menu item
2. ✅ Each page should load
3. ✅ No 404 errors

#### Test 3: Responsive Design
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on different sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1024px+)
4. ✅ Layout should adapt to screen size

#### Test 4: Error Handling
1. Try to trigger errors:
   - Go offline (DevTools > Network > Offline)
   - Try API calls
   - ✅ Should show error message instead of crashing

#### Test 5: Loading States
1. Watch for loading indicators
2. ✅ Should show "Loading..." or spinner while fetching data

#### Test 6: Buttons & Forms Work
1. Click buttons
2. ✅ Should trigger actions
3. Fill forms
4. ✅ Should submit data

#### Test 7: Colors & Styling
1. Check Tailwind CSS styling
2. ✅ Should look professional
3. ✅ Colors match design

#### Test 8: Dark Mode (If Implemented)
1. Look for dark mode toggle
2. Click it
3. ✅ Theme should change

---

### 9️⃣ DEPLOYMENT & INFRASTRUCTURE (10 Features)

#### Test 1: Health Check
```bash
# Terminal
curl http://localhost:8000/health

# Should return:
# {
#   "status": "healthy",
#   "service": "MSP Assistant API",
#   "version": "1.0.0"
# }
```

#### Test 2: Docker Build (If you have Docker installed)
```bash
# Terminal
cd backend
docker build -t msp-assistant-backend:latest .

# Should build successfully
```

#### Test 3: API Documentation
1. Open http://localhost:8000/docs
2. ✅ Should see Swagger UI
3. ✅ Should list all endpoints

#### Test 4: CORS Configuration
1. Check network tab when making API calls
2. ✅ Should not see CORS errors

#### Test 5: Error Handling
1. Send invalid requests:
   ```bash
   # Try invalid endpoint
   curl http://localhost:8000/api/invalid
   
   # Should return 404
   ```

#### Test 6: Performance (Optional)
1. Open DevTools > Network
2. Load dashboard
3. ✅ Page should load < 2 seconds
4. Check bundle sizes
5. ✅ Should be reasonable

#### Test 7: Database (DynamoDB Mock)
- All data stored locally for now
- Real AWS DynamoDB after deployment

#### Test 8: Logging
```bash
# Check backend terminal output
# Should see logs for each API request:
# 2026-05-14 10:30:45 - app.main - INFO - Starting...
# 2026-05-14 10:30:46 - uvicorn.error - INFO - Application startup complete
```

#### Test 9: Port 8000 Running
```bash
# Terminal
lsof -i :8000

# Should show uvicorn process running
```

#### Test 10: Port 3001 Running
```bash
# Terminal
lsof -i :3001

# Should show vite dev server running
```

---

### 🔟 CI/CD PIPELINE (9 Features - Local Simulation)

#### Test 1: Code Quality
```bash
# Backend linting
cd backend
flake8 app/

# Should run without errors (or show warnings only)
```

#### Test 2: Backend Tests (If tests exist)
```bash
# Terminal
cd backend
pytest tests/

# Should run tests and show results
```

#### Test 3: Frontend Build
```bash
# Terminal
cd frontend
npm run build

# Should build successfully
# Creates dist/ folder
```

#### Test 4: Frontend Size
```bash
# Check bundle size
ls -lh frontend/dist/

# Should be reasonable size (< 500KB)
```

#### Test 5: TypeScript Compilation
```bash
# Terminal
cd frontend
npx tsc --noEmit

# Should compile without errors
```

#### Test 6: Docker Image (If Docker installed)
```bash
# Terminal
cd backend
docker build -t msp-assistant:test .

# Should build successfully
```

#### Test 7: Environment Variables
```bash
# Check backend/.env exists
cat backend/.env

# Should have all required variables
```

#### Test 8: API Endpoints
```bash
# Test multiple endpoints
curl http://localhost:8000/api/costs/
curl http://localhost:8000/api/alerts/
curl http://localhost:8000/api/accounts/
curl http://localhost:8000/api/reports/

# All should return 200 status
```

#### Test 9: Frontend API Integration
1. Open DevTools > Network tab
2. Make some actions on frontend
3. ✅ Should see API calls being made
4. ✅ All calls should return 200 status

---

## 🧪 Complete Testing Workflow

### Session 1: Authentication (5 minutes)
```bash
1. Open http://localhost:3001
2. Login with admin@example.com / Demo@123
3. Should see dashboard
4. Check token in browser storage
5. Try accessing protected route
```

### Session 2: Data Display (5 minutes)
```bash
1. Check dashboard metrics
2. Go to Costs page - see cost data
3. Go to Alerts page - see alerts
4. Go to Reports page
5. Check Admin page - see accounts
```

### Session 3: AI Chat (3 minutes)
```bash
1. Go to Chat page
2. Ask: "How much are we spending?"
3. Get AI response
4. Send follow-up questions
5. Verify conversation history
```

### Session 4: API Testing (5 minutes)
```bash
1. Open http://localhost:8000/docs
2. Test endpoints one by one
3. Test GET /api/costs/
4. Test GET /api/alerts/
5. Test POST /api/chat/
```

### Session 5: Error Handling (3 minutes)
```bash
1. Go offline in DevTools
2. Try to make API call
3. Should show error gracefully
4. Go back online
5. Should work again
```

---

## 🔍 Debugging Tips

### Check Backend Logs
```bash
# Look at terminal where backend is running
# Should show request logs:
INFO:     127.0.0.1:55555 "GET /api/costs/ HTTP/1.1" 200

# If error, will show:
ERROR: ... error details ...
```

### Check Frontend Errors
```bash
# Open browser DevTools (F12)
# Check Console tab
# Should not see red errors
# Warnings (yellow) are OK
```

### Check Network Calls
```bash
# Open DevTools > Network tab
# Make actions on frontend
# Should see API calls
# Status should be 200 (success)
# Should not see CORS errors or 404s
```

### Check Database
```bash
# Backend uses SQLite locally
# Check if file exists:
ls -la backend/msp_assistant.db

# Should exist after first API call
```

---

## ✅ All Tests Checklist

```
AUTHENTICATION
☐ Login works
☐ Token stored
☐ Protected routes work
☐ Logout works

COST MANAGEMENT
☐ Costs display on dashboard
☐ Costs page shows data
☐ Recommendations show
☐ Export option available

MONITORING & ALERTS
☐ Alerts page loads
☐ Alerts display
☐ Can filter by severity
☐ Can mark as read

NOTIFICATIONS
☐ Webhook config shows
☐ Test webhook works
☐ Documentation available

AI CHAT
☐ Chat page loads
☐ Can send message
☐ AI responds
☐ History preserved

REPORTS
☐ Reports page loads
☐ Can generate report
☐ Report displays data
☐ Can download (if implemented)

ACCOUNTS
☐ Accounts page loads
☐ Accounts display
☐ Can add account (if implemented)
☐ Test connection works

USER INTERFACE
☐ All pages load
☐ Navigation works
☐ Responsive on mobile
☐ Error handling works

INFRASTRUCTURE
☐ Health check works
☐ API docs available
☐ Logging works
☐ No CORS errors

INTEGRATION
☐ Frontend → Backend communication
☐ All API endpoints responding
☐ No console errors
☐ No network errors
```

---

## 🚀 Testing Summary

| Component | How to Test | Expected Result |
|-----------|------------|-----------------|
| **Login** | Enter credentials | Dashboard appears |
| **Costs** | Click Costs tab | Table with 4 services shows |
| **Alerts** | Click Alerts tab | List of alerts shows |
| **Chat** | Click Chat, send message | AI responds in 2-3 seconds |
| **Reports** | Click Reports, generate | Report document appears |
| **Accounts** | Click Admin | 3 accounts shown |
| **API** | `curl http://localhost:8000/health` | `{"status":"healthy"}` |
| **Webhook** | `curl http://localhost:8000/api/webhooks/config` | Config details show |
| **UI** | Open DevTools | No red errors in console |
| **Performance** | Load page | < 2 seconds load time |

---

**Time Required**: ~30 minutes to test everything
**Expected Status**: ✅ All features should work in local environment

For detailed feature explanations, see: **WHAT_IS_THAT.md**
