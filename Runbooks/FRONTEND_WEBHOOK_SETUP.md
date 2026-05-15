# Frontend Webhook Configuration - Setup Guide

## 🎉 What's New

Instead of manually adding `TEAMS_WEBHOOK_URL` to GitHub secrets, you can now configure it **directly in the frontend admin panel**!

No more:
- ❌ Manual GitHub secrets
- ❌ Technical setup
- ❌ Redeploys needed

Yes to:
- ✅ Admin panel configuration
- ✅ User-friendly interface
- ✅ Test before saving
- ✅ Instant updates

---

## 🚀 How to Use

### Step 1: Access Admin Panel

1. Open: **http://localhost:3001** (or your production URL)
2. Login: admin@example.com / Demo@123
3. Click: **Admin** in navigation
4. Look for: **Webhook Settings** (new section)

### Step 2: Configure Teams Webhook

1. Click: **Enable Teams Webhook** button
2. Paste: Your Teams webhook URL
3. Click: **Test** to verify
4. Click: **Save**

### Step 3: Configure Slack Webhook (Optional)

Same as above, but for Slack

### Step 4: Done!

Alerts will now automatically send to Teams/Slack! 🎉

---

## 📋 Getting Webhook URLs

### For Microsoft Teams

1. Open your Teams channel
2. Click: **⋯ (More options)** → **Connectors**
3. Search: **Incoming Webhook**
4. Click: **Configure**
5. Name: **MSP Assistant** (or any name)
6. Optionally upload image
7. Click: **Create**
8. **Copy the URL** that appears
9. Paste into admin panel

### For Slack

1. Go to: **https://api.slack.com/apps**
2. Click: **Create New App**
3. Choose: **From scratch**
4. App name: **MSP Assistant**
5. Select workspace
6. Click: **Create App**
7. Click: **Incoming Webhooks** (left menu)
8. Toggle: **Activate Incoming Webhooks**
9. Click: **Add New Webhook to Workspace**
10. Select channel: Pick your channel
11. Click: **Allow**
12. **Copy the URL** that appears
13. Paste into admin panel

---

## 🎯 Features

✅ **Easy Configuration**
- No GitHub secrets needed
- Just paste URL
- Instant save

✅ **Test Before Using**
- Click "Test" button
- Sends test message to verify
- Confirms it's working

✅ **Security**
- URLs are masked in display
- Only shown as "***" after saving
- Still fully encrypted

✅ **Multiple Webhooks**
- Configure Teams AND Slack
- Both receive alerts
- Toggle on/off anytime

✅ **Show/Hide URL**
- Eye icon to toggle visibility
- Copy button for easy copying
- Password-masked for security

---

## 🔧 How to Add to Admin Panel

### Step 1: Import Component

In `frontend/src/pages/Admin.tsx`:

```typescript
import WebhookSettings from '../components/WebhookSettings';
```

### Step 2: Add Tab/Section

```typescript
const [activeTab, setActiveTab] = useState('accounts');

// In your render:
{activeTab === 'webhooks' && <WebhookSettings />}

// Add button to switch tabs:
<button onClick={() => setActiveTab('webhooks')}>
  Webhooks
</button>
```

### Step 3: Full Example

```typescript
import React, { useState } from 'react';
import WebhookSettings from '../components/WebhookSettings';

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('accounts');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('accounts')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'accounts'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          Accounts
        </button>
        <button
          onClick={() => setActiveTab('webhooks')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'webhooks'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          Webhooks
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'accounts' && (
        // Your existing accounts component
        <div>Accounts Content</div>
      )}

      {activeTab === 'webhooks' && (
        <WebhookSettings />
      )}
    </div>
  );
};
```

---

## 📊 API Endpoints

### Get Webhook Settings

```bash
GET /api/settings/webhooks

Response:
{
  "teams_webhook": {
    "webhook_type": "teams",
    "webhook_url": "https://outlook.webhook.office.com/...",
    "enabled": true,
    "configured": true
  },
  "slack_webhook": null
}
```

### Configure Webhook

```bash
POST /api/settings/webhooks/configure

Request:
{
  "webhook_type": "teams",
  "webhook_url": "https://outlook.webhook.office.com/...",
  "enabled": true
}

Response:
{
  "success": true,
  "webhook_type": "teams",
  "configured": true,
  "message": "Microsoft Teams webhook configured"
}
```

### Test Webhook

```bash
POST /api/settings/webhooks/test

Request:
{
  "webhook_type": "teams"
}

Response:
{
  "success": true,
  "message": "Test message sent successfully to teams",
  "webhook_type": "teams",
  "status_code": 200
}
```

### Get Setup Documentation

```bash
GET /api/settings/webhooks/docs

Response:
{
  "title": "Webhook Integration Setup",
  "webhook_types": {
    "teams": {
      "setup_steps": [...]
    },
    "slack": {
      "setup_steps": [...]
    }
  }
}
```

---

## 🎯 Workflow After Setup

### Old Way (Manual GitHub Secrets)
```
1. Get Teams webhook URL
2. Go to GitHub → Settings → Secrets
3. Add TEAMS_WEBHOOK_URL
4. Redeploy application
5. Wait for deployment
Total: 30 minutes
```

### New Way (Frontend Admin Panel)
```
1. Get Teams webhook URL (2 min)
2. Login to admin panel
3. Click Webhooks tab
4. Paste URL
5. Click Save
6. Instant! 🎉
Total: 5 minutes
```

---

## 🔐 Security

✅ **URLs are masked**
- Displayed as: `https://outlook.webhook.office.com/...***`
- Full URL only shown with eye icon

✅ **In-memory storage**
- Not persisted to database in demo
- Can be upgraded to persistent storage

✅ **Authorization required**
- All endpoints require JWT token
- Only authenticated admins can configure

✅ **HTTPS required**
- Webhook URLs must start with `https://`
- Prevents insecure URLs

---

## 🧪 Testing

### Test Teams Webhook

1. Configure Teams URL
2. Click **Test** button
3. Check your Teams channel
4. Should see: **"MSP Assistant Test"** message
5. Success! ✅

### Test Slack Webhook

Same as above, but in Slack channel

### What Test Message Shows

**Teams:**
```
MSP Assistant Test
Status: ✅ Working
Timestamp: Now
```

**Slack:**
```
MSP Assistant Test Notification
✅ Test Successful
Webhook is working correctly!
```

---

## 💡 Pro Tips

**Tip 1: Test Before Using**
- Always click "Test" after adding URL
- Ensures webhook is working
- Better to catch errors early

**Tip 2: Use Both Services**
- You can have Teams AND Slack
- Alerts go to both channels
- Different teams can monitor different channels

**Tip 3: Keep URLs Secret**
- Don't share webhook URLs
- They can post to your channels
- URLs are private secrets

**Tip 4: Refresh Page**
- Sometimes settings cache
- F5 to refresh if not updating
- Reload page after saving

---

## 🐛 Troubleshooting

### "Test message not received"

**Check:**
1. Is URL correct? (Copy-paste again)
2. Is channel correct? (Check Teams/Slack settings)
3. Is bot added to channel? (Check channel members)
4. Try again - sometimes takes a moment

**Fix:**
```
1. Copy fresh URL from Teams/Slack
2. Delete current URL
3. Paste new one
4. Test again
```

### "Invalid webhook URL"

**Error message:**
```
Invalid webhook URL. Must start with https://
```

**Fix:**
- Make sure URL starts with `https://`
- Don't include extra spaces
- Copy-paste carefully

### "Webhook not configured"

**Error message:**
```
Teams webhook not configured
```

**Fix:**
- Toggle "Enable Teams Webhook" ON
- Enter URL
- Click Save
- Then try Test

### "Settings not saving"

**Fix:**
1. Check network tab in browser DevTools
2. Verify JWT token is valid (login again)
3. Refresh page (F5)
4. Try again

---

## 🚀 Next Steps

1. **Configure Teams** (5 minutes)
   - Get webhook URL
   - Add to admin panel
   - Test it

2. **Configure Slack** (5 minutes, optional)
   - Get webhook URL
   - Add to admin panel
   - Test it

3. **Enable Auto-Alerts**
   - Alerts now send automatically
   - No manual setup needed
   - Just watch your channels!

---

## ✅ Success Checklist

After setup:

```
□ Accessed admin panel
□ Configured Teams webhook
□ Test message received in Teams
□ (Optional) Configured Slack webhook
□ Test message received in Slack
□ Alert is triggered manually
□ Notification appears in Teams/Slack
□ URLs are masked in admin panel
```

---

## 📞 Support

**Something not working?**

1. Check browser console (F12)
2. Check backend logs
3. Verify webhook URL format
4. Try test button
5. Check teams/slack channel permissions

**Need help?**

Backend logs show:
- Configuration changes
- Test attempts
- Error messages

Check logs:
```bash
# In backend terminal, look for:
[INFO] Updated teams webhook configuration
[ERROR] Test webhook failed: ...
```

---

## 🎉 You're All Set!

No more manual GitHub secrets for webhooks. Everything is configurable in the frontend admin panel!

**Features:**
- ✅ Easy configuration
- ✅ Test before saving
- ✅ Masked URLs
- ✅ Multiple webhooks
- ✅ Instant updates
- ✅ No redeployment needed

Happy alerting! 🚀

