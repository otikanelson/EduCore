# Quick Fix: "Failed to Fetch" Error

## TL;DR - The Fix

The error happens because **the backend server is not running**. Here's how to fix it:

### Option 1: Use the Startup Script (Easiest)

**On Windows:**
```bash
start-dev.bat
```

**On Mac/Linux:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

This will start both backend and frontend automatically.

### Option 2: Manual Start (Two Terminals)

**Terminal 1 - Start Backend:**
```bash
cd educore-os/backend
npm run start:dev
```

Wait until you see: `EduCore API running on port 3000`

**Terminal 2 - Start Frontend:**
```bash
cd educore-os/frontend
npm run dev
```

**IMPORTANT:** If the frontend was already running, you MUST restart it after creating the `.env` file!

## Why This Happens

1. **Backend Not Running**: The frontend tries to connect to `http://localhost:3000` but nothing is listening
2. **Environment Variables Not Loaded**: Vite only reads `.env` files when it starts, not while running
3. **CORS Issues**: (Less common) Backend doesn't allow requests from frontend

## Verify It's Working

1. Open http://localhost:5173
2. Click "Request School Access" or go to http://localhost:5173/login/direct
3. Login with:
   - Email: `admin@fieldgreen.edu`
   - Password: `password123`
4. You should be redirected to the admin dashboard

## Still Getting the Error?

### Check 1: Is Backend Running?
Open http://localhost:3000 in your browser. You should see a response (even if it's an error page, it means the server is running).

### Check 2: Check Backend Terminal
Look for this message:
```
EduCore API running on port 3000
```

If you see errors, the backend failed to start. Common issues:
- Missing dependencies: Run `npm install` in `educore-os/backend`
- Port already in use: Kill the process using port 3000

### Check 3: Check Frontend Terminal
Look for this message:
```
Local:   http://localhost:5173/
```

### Check 4: Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. The improved error message will tell you exactly what's wrong

## The Files I Created/Updated

1. **`.env`** - Contains the backend URL for local development
2. **`api.js`** - Better error messages when connection fails
3. **`start-dev.bat`** - Windows startup script
4. **`start-dev.sh`** - Mac/Linux startup script
5. **This guide** - To help you troubleshoot

## Next Steps After It Works

Once you can log in successfully:
- Test all the demo pages
- Try different user roles
- Prepare for deployment to Vercel

## For Deployment

When deploying to Vercel:
1. Deploy backend first, get its URL
2. Deploy frontend, set `VITE_API_URL` environment variable to backend URL
3. Both should work together

See `VERCEL_DEPLOYMENT_GUIDE.md` for detailed deployment instructions.
