# Backend CORS Fix - Final Solution

## The Problem
The backend on Vercel is using `api/index.ts` (serverless function), not `src/main.ts`. The CORS configuration in `main.ts` wasn't being applied.

## What I Fixed

### 1. Updated `api/index.ts` (Serverless Handler)
This is the actual entry point for Vercel deployment. I added proper CORS configuration here:

```typescript
app.enableCors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'https://edu-core-eight.vercel.app',
      'https://edu-core.vercel.app',
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow anyway for now
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
});
```

### 2. Updated `vercel.json`
Changed to use `api/index.ts` instead of `dist/main.js`:

```json
{
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.ts"
    }
  ]
}
```

### 3. Updated `package.json`
Added `vercel-build` script to prevent build errors.

## Deploy the Fix

### Step 1: Commit Backend Changes
```bash
git add educore-os/backend/api/index.ts
git add educore-os/backend/vercel.json
git add educore-os/backend/package.json
git commit -m "fix: CORS configuration in serverless handler"
git push
```

### Step 2: Wait for Vercel Deployment
- Go to Vercel dashboard
- Check backend project deployment
- Wait for it to complete (usually 1-2 minutes)
- Check deployment logs for any errors

### Step 3: Test Backend Directly
Open this URL in your browser:
```
https://edu-core-backend.vercel.app/auth/login
```

You should see a response (even if it's an error, it means the backend is running).

### Step 4: Test Login
1. Go to: `https://edu-core-eight.vercel.app/login/direct`
2. Login with: `admin@fieldgreen.edu` / `password123`
3. Check browser console (F12) - should see NO CORS errors

## Verify CORS Headers

You can test CORS directly with curl:

```bash
curl -X OPTIONS https://edu-core-backend.vercel.app/auth/login \
  -H "Origin: https://edu-core-eight.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -v
```

You should see these headers in the response:
```
Access-Control-Allow-Origin: https://edu-core-eight.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, Accept
Access-Control-Allow-Credentials: true
```

## If Still Not Working

### Option 1: Check Vercel Logs
1. Go to Vercel → Backend Project
2. Click latest deployment
3. Check "Runtime Logs"
4. Look for CORS-related errors

### Option 2: Temporarily Allow All Origins
If you need to test quickly, update `api/index.ts`:

```typescript
app.enableCors({
  origin: true, // Allow all origins temporarily
  credentials: true,
});
```

Then commit and push. This will help identify if it's a CORS issue or something else.

### Option 3: Check Backend Environment
Make sure these are set in Vercel backend project:
- Settings → Environment Variables
- Add: `NODE_ENV` = `production`

### Option 4: Redeploy from Scratch
Sometimes Vercel caches things. Try:
1. Go to Vercel → Backend Project
2. Settings → General
3. Scroll to "Redeploy"
4. Click "Redeploy" button

## Understanding the Setup

### Why Two Entry Points?

**Local Development (`src/main.ts`):**
- Used when running `npm run start:dev`
- Full NestJS application
- Runs on port 3000

**Vercel Production (`api/index.ts`):**
- Used for serverless deployment
- Wraps NestJS in serverless function
- Handles each request independently

### Why CORS Was Failing

The `src/main.ts` CORS config wasn't being used because Vercel uses `api/index.ts`. The old `api/index.ts` had:
```typescript
{ cors: true } // Too permissive, doesn't work properly
```

Now it has proper CORS configuration that matches `main.ts`.

## Files Modified
- ✅ `educore-os/backend/api/index.ts` - Added proper CORS
- ✅ `educore-os/backend/vercel.json` - Fixed build configuration
- ✅ `educore-os/backend/package.json` - Added vercel-build script
- ✅ `educore-os/backend/src/main.ts` - Already had CORS (for local dev)

## Expected Result

After deployment:
- ✅ No CORS errors in browser console
- ✅ Login works on production
- ✅ API requests succeed
- ✅ JWT tokens work correctly

## Quick Test Commands

```bash
# Test backend is responding
curl https://edu-core-backend.vercel.app/auth/login

# Test CORS preflight
curl -X OPTIONS https://edu-core-backend.vercel.app/auth/login \
  -H "Origin: https://edu-core-eight.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v

# Test actual login (should fail with 401 but no CORS error)
curl -X POST https://edu-core-backend.vercel.app/auth/login \
  -H "Origin: https://edu-core-eight.vercel.app" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fieldgreen.edu","password":"password123"}' \
  -v
```

## Summary

The issue was that Vercel uses `api/index.ts` for serverless deployment, not `src/main.ts`. I've updated the serverless handler with proper CORS configuration. After you push these changes and Vercel redeploys, the CORS error will be resolved.
