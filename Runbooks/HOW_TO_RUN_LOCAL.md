# How to Run MSP Assistant Locally - Step by Step

## ⚡ QUICK START (2 Minutes)

### You Already Have Running:
- ✅ Backend on http://localhost:8000
- ✅ Frontend on http://localhost:3001

### Just Open Browser:
```
http://localhost:3001
```

### Login with:
```
Email:    admin@example.com
Password: Demo@123
```

**That's it! You're done.**

---

## 📋 FULL SETUP FROM SCRATCH (If Starting Fresh)

### Step 1: Check Prerequisites (2 minutes)

```bash
# Check Python version (should be 3.11+)
python --version

# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version
```

**If any are missing:**
- Python: Download from python.org
- Node.js: Download from nodejs.org
- Both should be added to PATH (system will tell you during install)

---

### Step 2: Install Backend Dependencies (3 minutes)

```bash
# Go to backend folder
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install Python packages
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed fastapi uvicorn python-dotenv boto3 ...
```

---

### Step 3: Start Backend (1 minute)

```bash
# Make sure you're in backend folder
cd backend

# Make sure venv is activated (if you created one)
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate

# Start the server
python -m uvicorn app.main:app --reload
```

**Expected output:**
```
INFO:     Will watch for changes in these directories: ['D:\\One Data Solution\\AWS AI agent\\backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
2026-05-14 10:30:45 - app.core.logging - INFO - Logging configured
2026-05-14 10:30:46 - uvicorn.error - INFO - Started server process [12345]
2026-05-14 10:30:46 - app.main - INFO - Starting MSP Assistant Backend
2026-05-14 10:30:46 - uvicorn.error - INFO - Application startup complete.
```

**⚠️ If you see errors:**
- Port already in use? Kill other process or use different port:
  ```bash
  python -m uvicorn app.main:app --reload --port 8001
  ```
- Import error? Make sure requirements installed:
  ```bash
  pip install -r requirements.txt
  ```

✅ **Backend is now RUNNING. Keep this terminal open.**

---

### Step 4: Install Frontend Dependencies (2 minutes)

**Open NEW terminal window** (keep backend running in first terminal)

```bash
# Go to frontend folder
cd frontend

# Install npm packages
npm install
```

**Expected output:**
```
added 123 packages in 45s
```

---

### Step 5: Start Frontend (1 minute)

```bash
# Make sure you're in frontend folder
cd frontend

# Start development server
npm run dev
```

**Expected output:**
```
  VITE v5.4.21  ready in 359 ms

  ➜  Local:   http://localhost:3001/
  ➜  Network: http://192.168.1.43:3001/
```

**⚠️ If you see "Port 3000 is in use":**
- That's OK, it will use port 3001 automatically
- Or kill other process:
  ```bash
  # On Windows
  netstat -ano | findstr :3000
  taskkill /PID [PID] /F
  
  # On Mac/Linux
  lsof -i :3000
  kill -9 [PID]
  ```

✅ **Frontend is now RUNNING. Keep this terminal open too.**

---

### Step 6: Open Browser (30 seconds)

```
Open browser and go to: http://localhost:3001
```

**You should see:** Login page

```
┌─────────────────────────────────┐
│    MSP Assistant                │
│                                 │
│  Email: [________________]      │
│  Password: [________________]   │
│                                 │
│  [Login Button] [Sign Up Tab]  │
└─────────────────────────────────┘
```

---

### Step 7: Login (30 seconds)

```
Email:    admin@example.com
Password: Demo@123

Click [Login]
```

**After login, you should see:**

```
Dashboard
─────────────────────────────────────
Total Cost:           $5,625
Highest Cost Service: EC2 ($3,500)
Potential Savings:    $520
Services Count:       3

[Costs] [Alerts] [Chat] [Reports] [Admin]
```

✅ **You're in! Everything is working.**

---

## 🎯 Now You Have 3 Terminals Running

### Terminal 1: Backend
```
cd backend
python -m uvicorn app.main:app --reload
↓
http://localhost:8000
```

### Terminal 2: Frontend
```
cd frontend
npm run dev
↓
http://localhost:3001
```

### Terminal 3: For Running Commands
```
Use for testing APIs, git commands, etc.
```

---

## ✅ What to Test Now

### Test 1: Dashboard (30 seconds)
```
1. You should see dashboard
2. Should show:
   - Total Cost: $5,625
   - EC2 (Highest): $3,500
   - Potential Savings: $520
   - 3 Services
```

### Test 2: Costs Page
```
1. Click "Costs" in menu
2. Should see table with:
   - EC2: $2,450.50
   - S3: $580.25
   - Lambda: $120.75
   - RDS: $890.30
```

### Test 3: Alerts Page
```
1. Click "Alerts" in menu
2. Should see alert list with:
   - Alert type
   - Severity
   - Service
   - Message
```

### Test 4: Chat with AI
```
1. Click "Chat" in menu
2. Type: "How much am I spending?"
3. AI should respond
4. Continue conversation
```

### Test 5: API Documentation
```
1. Open: http://localhost:8000/docs
2. Should see Swagger UI
3. Can see all API endpoints
4. Can try endpoints directly
```

---

## 📁 Folder Structure After Setup

```
d:\One Data Solution\AWS AI agent\
├── backend/
│   ├── venv/                 ← Python virtual environment
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── core/
│   │   └── main.py
│   ├── .env                  ← Configuration
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── node_modules/         ← npm packages (created by npm install)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── .env
│
└── [other files]
```

---

## 🔧 Common Issues & Fixes

### Issue 1: Backend won't start - "Address already in use"
```bash
# On Windows
netstat -ano | findstr :8000
taskkill /PID [PID] /F

# On Mac/Linux
lsof -i :8000
kill -9 [PID]

# Then start backend on different port
python -m uvicorn app.main:app --reload --port 8001
```

### Issue 2: Frontend won't start - "Port 3000 already in use"
```bash
# This is fine, it uses 3001 automatically
# Or kill the process:
lsof -i :3000
kill -9 [PID]
```

### Issue 3: "ModuleNotFoundError: No module named 'fastapi'"
```bash
# Make sure virtual environment is activated
# On Windows:
backend\venv\Scripts\activate

# On Mac/Linux:
source backend/venv/bin/activate

# Then reinstall:
pip install -r requirements.txt
```

### Issue 4: "npm ERR! code ERESOLVE"
```bash
# Delete node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue 5: "React is not defined" error
```bash
# Usually just refresh the page
# Or check frontend/.env exists
# Should have:
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws
```

### Issue 6: Login fails - "Network error"
```bash
# Make sure backend is running
# Check backend terminal - should show requests coming in
# Backend URL should be: http://localhost:8000
# Frontend .env should point to correct backend URL
```

### Issue 7: "CORS error" in browser
```bash
# This shouldn't happen with current setup
# But if it does, check:
# 1. Backend is running
# 2. CORS_ORIGINS in backend/.env includes localhost:3001
# 3. Refresh browser (Ctrl+Shift+R hard refresh)
```

---

## 🔄 Workflow: Make Changes & Test

### Change Backend Code
```bash
1. Edit file in backend/app/
2. Save file
3. Backend automatically reloads (hot reload)
4. Refresh browser
5. New changes appear
```

**Example:**
```bash
# Edit: backend/app/api/costs.py
# Change recommendation from $400 to $800
# Save file
# Terminal shows: "Reloading..."
# Refresh browser
# Dashboard shows new value
```

### Change Frontend Code
```bash
1. Edit file in frontend/src/
2. Save file
3. Frontend automatically reloads (hot reload)
4. Changes appear in browser (usually automatically)
```

**Example:**
```bash
# Edit: frontend/src/pages/Dashboard.tsx
# Change title from "Dashboard" to "Cost Dashboard"
# Save file
# Browser shows: "Refreshing..."
# Title changes automatically
```

---

## 📊 Checking Status

### Check If Backend is Running
```bash
# Terminal 3
curl http://localhost:8000/health

# Should return:
# {"status":"healthy","service":"MSP Assistant API","version":"1.0.0"}
```

### Check If Frontend is Running
```bash
# Open browser
# http://localhost:3001

# Should load login page
```

### Check API Endpoints
```bash
# Terminal 3
# Get costs
curl http://localhost:8000/api/costs/

# Should return JSON with costs data
```

### Check Logs
```bash
# Backend terminal: Shows all API requests
# Info:     127.0.0.1:12345 "GET /api/costs/ HTTP/1.1" 200

# Frontend terminal: Shows build info
# ➜  Local:   http://localhost:3001/
```

---

## 🛑 How to Stop

### Stop Backend
```bash
# In backend terminal
Press Ctrl+C

# Terminal will show:
# Shutdown complete.
```

### Stop Frontend
```bash
# In frontend terminal
Press Ctrl+C

# Terminal will show:
# Shutdown complete.
```

### Stop All
```bash
# Press Ctrl+C in both terminals
# Or close terminal windows
```

---

## 🔄 Restart Everything

```bash
# Terminal 1: Start Backend
cd backend
python -m venv venv              # Only first time
venv\Scripts\activate            # Activate venv
python -m uvicorn app.main:app --reload

# Terminal 2: Start Frontend
cd frontend
npm install                      # Only first time
npm run dev

# Terminal 3: Open Browser
http://localhost:3001
Login: admin@example.com / Demo@123
```

---

## 📝 Quick Reference Card

| What | Where | How |
|------|-------|-----|
| **Start Backend** | Terminal 1 | `cd backend && python -m uvicorn app.main:app --reload` |
| **Start Frontend** | Terminal 2 | `cd frontend && npm run dev` |
| **Open App** | Browser | http://localhost:3001 |
| **API Docs** | Browser | http://localhost:8000/docs |
| **Health Check** | Terminal 3 | `curl http://localhost:8000/health` |
| **Login** | Browser | admin@example.com / Demo@123 |
| **Stop Backend** | Terminal 1 | Ctrl+C |
| **Stop Frontend** | Terminal 2 | Ctrl+C |
| **See Backend Logs** | Terminal 1 | Auto-displayed |
| **See Frontend Build** | Terminal 2 | Auto-displayed |

---

## ✅ Success Checklist

```
✅ Python installed (3.11+)
✅ Node.js installed (18+)
✅ Backend started (http://localhost:8000)
✅ Frontend started (http://localhost:3001)
✅ Can access login page
✅ Can login with admin@example.com / Demo@123
✅ Can see dashboard
✅ Can see costs
✅ Can see alerts
✅ Can chat with AI
✅ API docs work (http://localhost:8000/docs)
✅ No console errors
```

---

## 🎯 You're Ready!

You now have:
- ✅ Full backend API running
- ✅ Full frontend UI running
- ✅ Database with mock data
- ✅ AI integration ready
- ✅ All 94 features to test

**Next Steps:**
1. Explore the app in browser
2. Test all pages
3. Try APIs with Swagger UI
4. Read LOCAL_TESTING_GUIDE.md for detailed testing
5. Configure AWS credentials for real data (see DEPLOYMENT_GUIDE.md)

---

**Time Required**: 10-15 minutes for first-time setup
**Ongoing**: Just run 2 commands to start

Happy testing! 🚀
