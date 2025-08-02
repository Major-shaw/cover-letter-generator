#!/bin/bash

# Deployment script for Cover Letter Generator

echo "🚀 Deploying Cover Letter Generator to Vercel..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Please create it from env.example"
    echo "📝 Copy env.example to .env.local and add your Gemini API key"
    read -p "Do you want to continue? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install Vercel CLI if not already installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel whoami || vercel login

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📝 Don't forget to:"
echo "   1. Set GEMINI_API_KEY in your Vercel dashboard"
echo "   2. Go to Project Settings > Environment Variables"
echo "   3. Add GEMINI_API_KEY with your API key"
echo "   4. Redeploy if necessary"
echo ""
echo "🌐 Your app should be live at your Vercel URL!" 