#!/bin/bash

# EduCore OS Development Startup Script
# This script starts both backend and frontend servers

echo "🚀 Starting EduCore OS Development Servers..."
echo ""

# Check if we're in the right directory
if [ ! -d "educore-os" ]; then
    echo "❌ Error: educore-os directory not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo "⚠️  Warning: Port $1 is already in use!"
        return 1
    fi
    return 0
}

# Check ports
echo "📡 Checking ports..."
check_port 3000 || echo "   Backend port 3000 is busy"
check_port 5173 || echo "   Frontend port 5173 is busy"
echo ""

# Start backend
echo "🔧 Starting Backend (NestJS) on port 3000..."
cd educore-os/backend
npm run start:dev &
BACKEND_PID=$!
cd ../..
echo "   Backend PID: $BACKEND_PID"
echo ""

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend (Vite) on port 5173..."
cd educore-os/frontend
npm run dev &
FRONTEND_PID=$!
cd ../..
echo "   Frontend PID: $FRONTEND_PID"
echo ""

echo "✅ Both servers are starting..."
echo ""
echo "📝 Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo ""
echo "🔑 Demo Credentials:"
echo "   Admin:   admin@fieldgreen.edu / password123"
echo "   Teacher: teacher@fieldgreen.edu / password123"
echo "   Parent:  parent@fieldgreen.edu / password123"
echo "   Student: student@fieldgreen.edu / password123"
echo ""
echo "⏹️  To stop servers, press Ctrl+C"
echo ""

# Wait for user interrupt
wait
