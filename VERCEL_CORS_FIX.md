# Fix CORS Error on Vercel

## The Problem

You're seeing this error:
```
Access to fetch at 'https://edu-core-backend.vercel.app//auth/login' from origin 'https://edu-core-eight.vercel.app' has been blocked by CORS policy
```

This happens because:
1. **Double slash in URL** (`//auth/login`) - Fixed in frontend code
2. **CORS not configured** - Backend doesn't allow requests from your frontend domain

## What I Fixed

### 1. Frontend - Fixed Double Slash
Updated `educore-os/frontend/src/services/api.js` to remove trailing slashes from API_URL.

### 2. Backend - Updated CORS Configuration
Updated `educore-os/backend/src/main.ts` to allow requests from:
- `http://localhost:5173` (local development)
- `https://edu-core-eight.vercel.app` (your production frontend)
- `https://edu-core.vercel.app` (alternative domain)

### 3. Production Environment Variable
Updated `educore-os/frontend/.env.production` with your backend URL (without trailing slash).

## Steps to Deploy the Fix

### Step 1: Commit and Push Backend Changes
```bash
git add educore-os/backend/src/main.ts
git commit -m "fix: Update CORS configuration for production"
git push
```

Vercel will automatically redeploy your backend.

### Step 2: Commit and Push Frontend Changes
```bash
git add educore-os/frontend/src/services/api.js
git add educore-os/frontend/.env.production
git commit -m "fix: Remove trailing slash from API URL and update production config"
git push
```

Vercel will automatically redeploy your frontend.

### Step 3: Set Environment Variable in Vercel (Frontend)

Go to your frontend project on Vercel:
1. Go to **Settings** → **Environment Variables**
2. Add/Update:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://edu-core-backend.vercel.app` (NO trailing slash!)
   - **Environment**: Production
3. Click **Save**
4. Go to **Deployments** tab
5. Click the three dots on the latest deployment
6. Click **Redeploy**

### Step 4: Verify Backend CORS

After backend redeploys, check the logs:
1. Go to backend project on Vercel
2. Click on latest deployment
3. Check **Runtime Logs**
4. Look for: `EduCore API running on port 3000`

## Testing After Deployment

1. Visit your frontend: `https://edu-core-eight.vercel.app`
2. Go to login page
3. Try logging in with: `admin@fieldgreen.edu` / `password123`
4. Open browser DevTools (F12) → Console
5. You should NOT see CORS errors anymore

## If You Still See CORS Errors

### Check 1: Verify Backend Redeployed
Make sure the backend actually redeployed with the new CORS settings.

### Check 2: Check Exact Frontend URL
If your frontend URL is different, update the `allowedOrigins` array in `educore-os/backend/src/main.ts`:

```typescript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-actual-frontend-url.vercel.app', // Add your actual URL here
];
```

### Check 3: Clear Browser Cache
Sometimes browsers cache CORS errors. Try:
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Open in incognito/private window
- Clear browser cache

### Check 4: Check Environment Variables
In Vercel frontend project:
- Go to Settings → Environment Variables
- Verify `VITE_API_URL` is set correctly
- Make sure there's NO trailing slash

## Alternative: Allow All Origins (Not Recommended for Production)

If you need a quick fix for testing, you can temporarily allow all origins:

```typescript
// In educore-os/backend/src/main.ts
app.enableCors({
  origin: true, // Allow all origins (NOT SECURE!)
  credentials: true,
});
```

**WARNING**: This is insecure and should only be used for testing!

## Production-Ready CORS Configuration

The configuration I added is production-ready and secure:
- Only allows specific domains
- Allows credentials (for JWT tokens)
- Specifies allowed methods and headers
- Handles preflight requests correctly

## Summary of Changes

| File | Change | Why |
|------|--------|-----|
| `frontend/src/services/api.js` | Remove trailing slash from API_URL | Prevents `//auth/login` double slash |
| `backend/src/main.ts` | Add production frontend to CORS | Allows requests from Vercel frontend |
| `frontend/.env.production` | Set correct backend URL | Ensures frontend knows where backend is |

After these changes are deployed, your login should work on Vercel!
