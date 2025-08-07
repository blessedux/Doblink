#!/bin/bash

# DOB Link Deployment Script
# This script handles deployment of the separated architecture

set -e

echo "🚀 Starting DOB Link deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies for all projects
echo "📦 Installing dependencies..."
npm run install:all

# Build all projects
echo "🔨 Building projects..."
npm run build

# Check if builds were successful
if [ ! -d "dob-link-dashboard/.next" ]; then
    echo "❌ Error: Dashboard build failed"
    exit 1
fi

if [ ! -d "dob-link-widget/dist" ]; then
    echo "❌ Error: Widget build failed"
    exit 1
fi

echo "✅ Build completed successfully!"

# Display build sizes
echo "📊 Build sizes:"
echo "Dashboard: $(du -sh dob-link-dashboard/.next | cut -f1)"
echo "Widget: $(du -sh dob-link-widget/dist | cut -f1)"

# Check widget bundle size
WIDGET_SIZE=$(du -sb dob-link-widget/dist/dob-link-widget.umd.js | cut -f1)
WIDGET_SIZE_KB=$((WIDGET_SIZE / 1024))

echo "Widget bundle size: ${WIDGET_SIZE_KB}KB"

if [ $WIDGET_SIZE_KB -gt 100 ]; then
    echo "⚠️  Warning: Widget bundle is larger than 100KB"
else
    echo "✅ Widget bundle size is optimal"
fi

echo "🎉 Deployment ready!"
echo ""
echo "Next steps:"
echo "1. Deploy to Vercel: vercel --prod"
echo "2. Or deploy manually to your hosting platform"
echo "3. Update CDN URLs in production"
echo ""
echo "Dashboard will be available at: https://your-domain.com"
echo "Widget will be available at: https://your-domain.com/widget/" 