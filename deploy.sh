#!/bin/bash

# OmniCore Wallet - Quick Deployment Script
# This script helps deploy the application quickly

set -e

echo "🚀 OmniCore Wallet Deployment Script"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Menu
echo "Select deployment option:"
echo "1) Build for production"
echo "2) Build and preview locally"
echo "3) Build Docker image"
echo "4) Deploy with Docker Compose"
echo "5) Exit"
echo ""
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo ""
        echo "📦 Building for production..."
        npm install --legacy-peer-deps
        npm run build
        echo ""
        echo "✅ Build complete! Output in ./dist directory"
        echo ""
        echo "Next steps:"
        echo "- Deploy ./dist to your hosting provider"
        echo "- Or run: npm run preview to test locally"
        ;;
    2)
        echo ""
        echo "📦 Building and starting preview server..."
        npm install --legacy-peer-deps
        npm run build
        echo ""
        echo "🌐 Starting preview server..."
        npm run preview
        ;;
    3)
        echo ""
        echo "🐳 Building Docker image..."
        if ! command -v docker &> /dev/null; then
            echo "❌ Docker is not installed. Please install Docker first."
            exit 1
        fi
        docker build -t omnicore-wallet:latest .
        echo ""
        echo "✅ Docker image built successfully!"
        echo ""
        echo "Next steps:"
        echo "- Run: docker run -d -p 80:80 omnicore-wallet:latest"
        echo "- Or use docker-compose: docker-compose up -d"
        ;;
    4)
        echo ""
        echo "🐳 Deploying with Docker Compose..."
        if ! command -v docker-compose &> /dev/null; then
            echo "❌ Docker Compose is not installed. Please install Docker Compose first."
            exit 1
        fi
        docker-compose up -d
        echo ""
        echo "✅ Application deployed!"
        echo "🌐 Access at: http://localhost"
        echo ""
        echo "Useful commands:"
        echo "- View logs: docker-compose logs -f"
        echo "- Stop: docker-compose down"
        echo "- Restart: docker-compose restart"
        ;;
    5)
        echo "Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac
