# Backend Setup Guide

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

### Required Variables

```env
# Database Configuration
# PostgreSQL connection string
# Format: postgresql://username:password@host:port/database
DATABASE_URL=postgresql://postgres:password@localhost:5432/petmart

# Stripe Configuration
# Get your Stripe secret key from https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Stripe Webhook Secret (for production webhooks)
# Get this from your Stripe webhook settings
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Optional Variables

```env
# Frontend URL (for CORS and redirects)
FRONTEND_URL=http://localhost:4200

# Server Port (defaults to 3000)
PORT=3000

# Node Environment
NODE_ENV=development
```

## Database Setup

### Option 1: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database:
   ```sql
   CREATE DATABASE petmart;
   ```
3. Update `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/petmart
   ```

### Option 2: Cloud Database (Recommended for Development)

You can use free PostgreSQL services:

- **Supabase**: https://supabase.com (free tier available)
- **Neon**: https://neon.tech (free tier available)
- **Railway**: https://railway.app (free tier available)

After creating a database, copy the connection string and set it as `DATABASE_URL`.

The application uses raw PostgreSQL queries via the `pg` library. Make sure your database schema matches the expected structure (Product, Order, OrderItem tables).

## Stripe Setup

1. Sign up at https://stripe.com
2. Go to https://dashboard.stripe.com/apikeys
3. Copy your **Test** secret key (starts with `sk_test_`)
4. Add it to `.env` as `STRIPE_SECRET_KEY`

## Starting the Server

After setting up your `.env` file:

```bash
npm run start:dev
```

Or use the PowerShell script:

```powershell
.\start-server.ps1
```

## Troubleshooting

### "Database is not configured" Error

- Make sure `.env` file exists in the `backend` directory
- Verify `DATABASE_URL` is set correctly
- Check that your database server is running
- Test the connection string format

### "Stripe is not configured" Error

- Make sure `STRIPE_SECRET_KEY` is set in `.env`
- Verify the key starts with `sk_test_` (for test mode) or `sk_live_` (for production)

