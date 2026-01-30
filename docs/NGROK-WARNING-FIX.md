# NgRok Browser Warning Fix

## The Problem
NgRok (free tier) shows a warning page asking "Are you the developer?" to prevent abuse. This page appears before users can access your Node-RED dashboard.

## The Solution
We automatically bypass this warning by adding the `ngrok-skip-browser-warning=true` parameter to all ngrok URLs.

## How It Works

### Automatic Detection & Fix
The application automatically detects ngrok URLs and adds the skip parameter:

```typescript
// Before: https://abc123.ngrok-free.app/ui/#!/0
// After:  https://abc123.ngrok-free.app/ui/#!/0?ngrok-skip-browser-warning=true
```

### Code Implementation
In `green-guardian-dashboard.tsx`:

```typescript
const nodeRedUrl = useMemo(() => {
  const base = rawNodeRedUrl.replace(/\/$/, "");
  // ... URL normalization logic ...
  
  // Add ngrok skip parameter for ngrok URLs
  if (finalUrl.includes('ngrok')) {
    return `${finalUrl}?ngrok-skip-browser-warning=true`;
  }
  return finalUrl;
}, [rawNodeRedUrl]);
```

## Manual Testing
You can test the skip functionality by visiting:
```
https://your-ngrok-url.ngrok-free.app/ui?ngrok-skip-browser-warning=true
```

## Alternative Methods

### 1. HTTP Headers (for API calls only)
```javascript
fetch(url, {
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
});
```

### 2. Custom Domain (Paid NgRok)
Upgrade to ngrok Pro to use custom domains without warnings.

### 3. Production Alternative
For production, deploy Node-RED to a permanent cloud service:
- FlowFuse
- Heroku
- Railway
- DigitalOcean

## Verification
After implementing the fix:
1. ✅ No "Are you the developer?" warning page
2. ✅ Direct access to Node-RED dashboard
3. ✅ IoT data loads immediately
4. ✅ Smooth iframe integration

## Troubleshooting
If warnings still appear:
- Check that the URL contains `?ngrok-skip-browser-warning=true`
- Verify ngrok is running on the correct port (1880)
- Clear browser cache
- Restart ngrok if URL changed