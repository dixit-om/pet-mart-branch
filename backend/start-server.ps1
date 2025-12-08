# Backend Server Startup Script
Write-Host "🚀 Starting Pet Mart Backend Server..." -ForegroundColor Green
Write-Host ""

# Check if .env file exists
if (-not (Test-Path .env)) {
    Write-Host "⚠️  Warning: .env file not found!" -ForegroundColor Yellow
    Write-Host "   Make sure DATABASE_URL is set in your environment or .env file" -ForegroundColor Yellow
    Write-Host ""
}

# Generate Prisma Client
Write-Host "📦 Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate
Write-Host ""

# Start the server
Write-Host "🎯 Starting NestJS server on http://localhost:3000" -ForegroundColor Cyan
Write-Host "📊 GraphQL Playground will be available at http://localhost:3000/graphql" -ForegroundColor Cyan
Write-Host ""
npm run start:dev




