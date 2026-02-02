#!/bin/bash

echo "🔧 Deploying CORS Fix to Vercel..."
echo ""

# Add all backend changes
echo "📦 Adding backend changes..."
git add educore-os/backend/api/index.ts
git add educore-os/backend/vercel.json
git add educore-os/backend/package.json
git add educore-os/backend/src/main.ts

# Add frontend changes
echo "📦 Adding frontend changes..."
git add educore-os/frontend/src/services/api.js
git add educore-os/frontend/.env.production

# Commit
echo "💾 Committing changes..."
git commit -m "fix: CORS configuration for Vercel serverless deployment"

# Push
echo "🚀 Pushing to trigger Vercel deployment..."
git push

echo ""
echo "✅ Changes pushed!"
echo ""
echo "📋 Next steps:"
echo "1. Wait for Vercel to redeploy (check dashboard)"
echo "2. Test login at: https://edu-core-eight.vercel.app/login/direct"
echo "3. Use credentials: admin@fieldgreen.edu / password123"
echo ""
echo "🔍 Check deployment status:"
echo "   Backend:  https://vercel.com/your-username/edu-core-backend"
echo "   Frontend: https://vercel.com/your-username/edu-core-eight"
echo ""
