# Deploy CORS Fix - Quick Steps

## What I Fixed
1. ✅ Removed double slash from API URLs
2. ✅ Updated backend CORS to allow your frontend domain
3. ✅ Set correct production environment variables

## Deploy Now (3 Steps)

### Step 1: Push Backend Fix
```bash
git add educore-os/backend/src/main.ts
git commit -m "fix: CORS configuration for production"
git push
```

Wait for Vercel to redeploy backend (check Vercel dashboard).

### Step 2: Push Frontend Fix
```bash
git add educore-os/frontend/src/services/api.js educore-os/frontend/.env.production
git commit -m "fix: API URL trailing slash issue"
git push
```

Wait for Vercel to redeploy frontend.

### Step 3: Set Vercel Environment Variable

**In Vercel Frontend Project:**
1. Settings → Environment Variables
2. Add/Update `VITE_API_URL` = `https://edu-core-backend.vercel.app`
3. Save
4. Deployments → Redeploy latest

## Test It
1. Go to `https://edu-core-eight.vercel.app/login/direct`
2. Login: `admin@fieldgreen.edu` / `password123`
3. Should work without CORS errors!

## Files Changed
- `educore-os/backend/src/main.ts` - CORS config
- `educore-os/frontend/src/services/api.js` - URL fix
- `educore-os/frontend/.env.production` - Backend URL

That's it! The CORS error will be gone after these deploys.
