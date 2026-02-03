# Daily Spark Deployment Guide

## Pre-Deployment Checklist

### 1. Domain Setup
- [ ] Purchase domain (dailyspark.app or similar)
- [ ] Add domain to Vercel project
- [ ] Configure DNS records

### 2. Resend (Email)
- [ ] Create account at https://resend.com
- [ ] Add and verify your domain (for custom from address)
- [ ] Get API key from dashboard
- [ ] Set `RESEND_API_KEY` in Vercel

### 3. Stripe (Payments)
- [ ] Create account at https://stripe.com
- [ ] Complete business verification
- [ ] Get API keys (test first, then live)
- [ ] Create webhook endpoint in Stripe dashboard:
  - URL: `https://your-domain.com/api/webhooks/stripe`
  - Events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`
- [ ] Set environment variables:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`

### 4. Replicate (AI Images) — Optional for MVP
- [ ] Create account at https://replicate.com
- [ ] Add billing information
- [ ] Get API token
- [ ] Set `REPLICATE_API_TOKEN` in Vercel
- [ ] Set `USE_MOCK_IMAGES=false` for real AI generation

### 5. Vercel Environment Variables

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

```
# Required
RESEND_API_KEY=re_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_BASE_URL=https://dailyspark.app
CRON_SECRET=your_random_32_char_string

# Optional (can use mock images without)
REPLICATE_API_TOKEN=r8_xxxxx
USE_MOCK_IMAGES=true  # Set to false when Replicate is configured

# Email sender (optional, has defaults)
FROM_EMAIL=Daily Spark <hello@dailyspark.app>
```

## Deployment Steps

### Option A: Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import from GitHub: `solonawang-lab/daily-spark`
4. Add environment variables (see above)
5. Click Deploy

### Option B: Vercel CLI

```bash
cd /Users/solona/projects/daily-spark
npm i -g vercel
vercel login
vercel --prod
```

## Post-Deployment

### 1. Verify Cron Job
- Vercel should automatically set up the cron from `vercel.json`
- Check Vercel Dashboard → Project → Settings → Cron Jobs
- Cron runs at 6am EST (11:00 UTC) daily

### 2. Test the Flow
1. Sign up with your email (free trial)
2. Check welcome email arrives
3. Manually trigger `/api/cron/send-daily` to test daily email
4. Test Stripe checkout with test card: `4242 4242 4242 4242`
5. Verify webhook processes correctly

### 3. Monitor
- Vercel Dashboard → Logs for API errors
- Resend Dashboard → Email delivery stats
- Stripe Dashboard → Payment activity

## Rollback

If something goes wrong:
```bash
vercel rollback
```

Or use Vercel Dashboard → Deployments → select previous deployment → Promote to Production

## Scaling Notes

Current MVP uses file-based storage (`data/subscribers.json`). For scale:
1. Migrate to Vercel KV or PostgreSQL (Neon/Supabase)
2. Add rate limiting to API endpoints
3. Consider edge functions for faster global delivery

## Support

- Resend: https://resend.com/docs
- Stripe: https://stripe.com/docs
- Vercel: https://vercel.com/docs
- Replicate: https://replicate.com/docs
