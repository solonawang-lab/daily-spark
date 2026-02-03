# Daily Spark - Deployment Plan

## Overview

This document covers deployment strategy for both **global users** and **China users** (RedNote/Xiaohongshu marketing).

---

## 1. Architecture Overview

```
                    ┌─────────────────────────────────────┐
                    │           Daily Spark               │
                    └─────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
            ┌──────────────┐               ┌──────────────┐
            │   GLOBAL     │               │    CHINA     │
            │   (Vercel)   │               │  (Alibaba)   │
            └──────────────┘               └──────────────┘
                    │                               │
            ┌───────┴───────┐               ┌───────┴───────┐
            ▼               ▼               ▼               ▼
        Vercel Edge    Supabase         Alibaba CDN    Alibaba RDS
        (Global CDN)   (Postgres)       (China nodes)  (China DB)
                            │                               │
                            └───────────┬───────────────────┘
                                        ▼
                                   Replicate API
                              (via proxy for China)
```

---

## 2. Global Deployment (Primary)

### Stack
| Component | Service | Why |
|-----------|---------|-----|
| Frontend + API | **Vercel** | Free tier, global CDN, instant deploys |
| Database | **Supabase** | Free tier, Postgres, auth built-in |
| AI Images | **Replicate** | Cheapest (FLUX Schnell) |
| Email | **Resend** | Dev-friendly, good deliverability |
| Payments | **Stripe** | Industry standard |
| Domain | **Cloudflare** | Free DNS, DDoS protection |

### Deployment Steps

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy (from project root)
cd /Users/solona/projects/daily-spark
vercel

# 4. Set environment variables
vercel env add REPLICATE_API_TOKEN
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add RESEND_API_KEY
vercel env add STRIPE_SECRET_KEY

# 5. Deploy to production
vercel --prod
```

### Domain Setup
1. Buy domain: `dailyspark.app` (~$12/year on Namecheap/Cloudflare)
2. Add to Vercel: Settings → Domains → Add
3. Update DNS: Point to Vercel's nameservers
4. SSL: Automatic via Vercel

### Estimated Costs (Global)
| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Vercel | 100GB bandwidth | $20/mo Pro |
| Supabase | 500MB DB, 50K MAU | $25/mo |
| Replicate | Pay per use | ~$0.003/image |
| Resend | 3K emails/mo | $20/mo for 50K |
| Stripe | 2.9% + $0.30 | Same |
| **Total** | **~$0.003/image** | **~$65/mo + usage** |

---

## 3. China Deployment (RedNote Users)

### The Challenge
- Great Firewall blocks: Vercel, Supabase, Stripe, Replicate
- Need ICP license for .cn domain (requires Chinese business entity)
- Payment: Must support Alipay/WeChat Pay

### Solution: Hybrid Architecture

#### Option A: Hong Kong Edge (Simpler, Good Enough)
**Best for MVP/testing Chinese market**

| Component | Service | Notes |
|-----------|---------|-------|
| Frontend | Vercel (HK region) | Usually accessible from China |
| CDN | Cloudflare | Has China partnership |
| API Proxy | Cloudflare Workers | Proxy Replicate calls |
| Payments | LemonSqueezy | Supports Alipay |

**Pros:** Simple, no ICP needed, one codebase
**Cons:** Slower in mainland China, might be blocked occasionally

#### Option B: Full China Stack (Better UX, More Complex)
**For scaling in China**

| Component | Service | Notes |
|-----------|---------|-------|
| Frontend | **Alibaba Cloud China** | Fast in mainland |
| CDN | Alibaba CDN | China-optimized |
| Database | Alibaba RDS | China region |
| AI Images | **Self-hosted FLUX** or **Alibaba AI** | Replicate blocked |
| Payments | **Alipay + WeChat Pay** | Via Stripe China or direct |
| Domain | `.com` + China CDN | No ICP needed for .com |

**Pros:** Best UX for Chinese users
**Cons:** Need separate deployment, China business entity for some features

### Recommended Approach: Phased

```
Phase 1 (MVP):     Vercel HK + LemonSqueezy (Alipay)
Phase 2 (Traction): Add Cloudflare China CDN
Phase 3 (Scale):   Full Alibaba Cloud deployment
```

---

## 4. China-Specific Implementation

### 4.1 Payment: LemonSqueezy with Alipay

LemonSqueezy supports Alipay out of the box:

```typescript
// No code change needed - enable in LemonSqueezy dashboard
// Users see Alipay option at checkout automatically
```

Setup:
1. Create account at lemonsqueezy.com
2. Settings → Payment Methods → Enable Alipay
3. Create product ($3/mo Daily plan)
4. Get checkout URL

### 4.2 API Proxy for Replicate (China Access)

Create Cloudflare Worker to proxy Replicate:

```typescript
// cloudflare-worker.js
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Proxy to Replicate
    if (url.pathname.startsWith('/api/replicate')) {
      const replicateUrl = 'https://api.replicate.com' + 
        url.pathname.replace('/api/replicate', '');
      
      return fetch(replicateUrl, {
        method: request.method,
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: request.body,
      });
    }
    
    return fetch(request);
  }
};
```

### 4.3 Language Support

Add Chinese language to the app:

```typescript
// lib/i18n.ts
export const translations = {
  en: {
    title: "Daily Spark ✨",
    subtitle: "AI-generated wallpapers with inspiring quotes",
    generate: "Generate Wallpaper",
    download: "Download",
    // ...
  },
  zh: {
    title: "每日灵感 ✨",
    subtitle: "AI生成的励志壁纸，每天一句激励语",
    generate: "生成壁纸",
    download: "下载",
    // ...
  }
};

// Detect language
const lang = navigator.language.startsWith('zh') ? 'zh' : 'en';
```

### 4.4 Chinese Quote Library

Add Chinese quotes to `data/quotes.json`:

```json
{
  "stoicism_zh": [
    { "text": "障碍即是道路", "author": "马可·奥勒留" },
    { "text": "我们在想象中受的苦比现实中更多", "author": "塞内卡" }
  ],
  "productivity_zh": [
    { "text": "完成比完美更重要", "author": "谢丽尔·桑德伯格" },
    { "text": "专注于高效，而非忙碌", "author": "蒂姆·费里斯" }
  ]
}
```

---

## 5. Deployment Checklist

### Pre-Launch
- [ ] Buy domain (dailyspark.app)
- [ ] Set up Vercel project
- [ ] Configure environment variables
- [ ] Set up Supabase database
- [ ] Configure Stripe/LemonSqueezy
- [ ] Enable Alipay (LemonSqueezy)
- [ ] Add Replicate billing
- [ ] Test end-to-end flow

### Launch Day
- [ ] Deploy to production (`vercel --prod`)
- [ ] Verify SSL certificate
- [ ] Test payment flow (Stripe + Alipay)
- [ ] Test wallpaper generation
- [ ] Monitor error logs

### Post-Launch
- [ ] Set up monitoring (Vercel Analytics)
- [ ] Configure alerts (uptime, errors)
- [ ] Set up backup (Supabase)

---

## 6. Environment Variables

```bash
# .env.local (development)
# .env.production (Vercel)

# AI Image Generation
REPLICATE_API_TOKEN=r8_xxx
USE_MOCK_IMAGES=false  # true for dev

# Database
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# Email
RESEND_API_KEY=re_xxx

# Payments
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# LemonSqueezy (for Alipay)
LEMONSQUEEZY_API_KEY=xxx
LEMONSQUEEZY_STORE_ID=xxx
LEMONSQUEEZY_WEBHOOK_SECRET=xxx

# App
NEXT_PUBLIC_APP_URL=https://dailyspark.app
```

---

## 7. CI/CD Pipeline

Vercel handles this automatically:

```
Push to main → Vercel builds → Deploy to production
Push to branch → Vercel builds → Deploy to preview URL
```

### GitHub Integration
1. Connect GitHub repo to Vercel
2. Every push triggers deployment
3. Preview URLs for PRs

---

## 8. Monitoring & Alerts

### Vercel Analytics (Built-in)
- Page views, visitors
- Core Web Vitals
- Error tracking

### Recommended Additions
| Tool | Purpose | Cost |
|------|---------|------|
| Sentry | Error tracking | Free tier |
| Better Uptime | Uptime monitoring | Free tier |
| LogSnag | Event logging | Free tier |

---

## 9. Scaling Considerations

### When to Upgrade

| Metric | Free Tier Limit | Action |
|--------|-----------------|--------|
| Vercel bandwidth | 100GB/mo | Upgrade to Pro ($20) |
| Supabase DB | 500MB | Upgrade to Pro ($25) |
| Supabase MAU | 50K | Upgrade to Pro |
| Resend emails | 3K/mo | Upgrade ($20 for 50K) |

### Cost at Scale

| Users | Monthly Cost | Notes |
|-------|--------------|-------|
| 100 | ~$10 | Free tiers |
| 1,000 | ~$100 | Some paid tiers |
| 10,000 | ~$500 | All paid, optimized |
| 100,000 | ~$2,000 | Need enterprise deals |

---

## 10. China Market Checklist

### MVP (Test the Market)
- [ ] Enable Alipay via LemonSqueezy
- [ ] Add Chinese language support
- [ ] Add Chinese quotes
- [ ] Test from China (use VPN or ask Chinese friend)
- [ ] Create RedNote account
- [ ] Post first content on RedNote

### Growth (If Traction)
- [ ] Set up Cloudflare China CDN
- [ ] Consider Alibaba Cloud deployment
- [ ] Partner with Chinese influencers
- [ ] Localize marketing content

### Scale (Serious China Business)
- [ ] Register Chinese business entity
- [ ] Get ICP license
- [ ] Full Alibaba Cloud deployment
- [ ] Direct Alipay/WeChat Pay integration
- [ ] Hire Chinese community manager

---

## Quick Start Commands

```bash
# Deploy to Vercel (first time)
cd /Users/solona/projects/daily-spark
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Set environment variable
vercel env add REPLICATE_API_TOKEN production
```

---

*Last updated: February 2026*
