# Fix "Failed to Fetch" Error

## The Problem
The "failed to fetch" error occurs when the frontend tries to connect to the backend API, but the backend is either:
1. Not running
2. Running on a different port
3. Not accessible due to CORS issues

## Solution Steps

### Step 1: Check if Backend is Running
Open a terminal and check if the backend is running:

```bash
cd educore-os/backend
npm run start:dev
```

The backend should start on **port 3000** and show:
```
[Nest] Application successfully started on: http://localhost:3000
```

### Step 2: Restart Frontend (Important!)
After creating the `.env` file, you MUST restart the frontend dev server to pick up the new environment variables:

1. Stop the frontend server (Ctrl+C in the terminal)
2. Start it again:
```bash
cd educore-os/frontend
npm run dev
```

### Step 3: Verify Environment Variables
Check that the `.env` file exists and has the correct content:

**File: `educore-os/frontend/.env`**
```
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=EduCore OS
```

### Step 4: Test the Connection
1. Open your browser to http://localhost:5173
2. Click "Request School Access" or go to http://localhost:5173/login/direct
3. Try logging in with demo credentials:
   - Email: `admin@fieldgreen.edu`
   - Password: `password123`

## Expected Behavior

### If Backend is Running:
- Login should work
- You'll be redirected to the appropriate dashboard based on your role

### If Backend is NOT Running:
- You'll see an error: "Cannot connect to server. Please ensure the backend is running at http://localhost:3000"
- This is the improved error message I just added

## Quick Start Commands

Run these in **separate terminals**:

**Terminal 1 - Backend:**
```bash
cd educore-os/backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd educore-os/frontend
npm run dev
```

## Demo Accounts

Once both servers are running, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fieldgreen.edu | password123 |
| Teacher | teacher@fieldgreen.edu | password123 |
| Parent | parent@fieldgreen.edu | password123 |
| Student | student@fieldgreen.edu | password123 |

## Still Having Issues?

### Check Backend Logs
Look at the backend terminal for any errors. Common issues:
- Port 3000 already in use
- Missing dependencies (run `npm install`)
- Database connection errors (we're using in-memory data, so this shouldn't happen)

### Check Frontend Console
Open browser DevTools (F12) and check the Console tab for errors. You should see:
- The API URL being used
- Any network errors
- Detailed error messages

### Verify CORS
The backend is already configured to allow requests from `http://localhost:5173`. If you're running on a different port, update the CORS settings in `educore-os/backend/src/main.ts`.

## Production Deployment

For Vercel deployment, you'll need to:
1. Deploy backend to Vercel (separate project)
2. Get the backend URL (e.g., `https://your-backend.vercel.app`)
3. Set environment variable in frontend Vercel project:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.vercel.app`
