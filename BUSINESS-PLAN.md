# Daily Spark - Business Plan

**Version:** 1.0
**Date:** February 2026
**Author:** Lei + Solona

---

## 1. Executive Summary

**Daily Spark** is a subscription service that delivers a fresh, AI-generated wallpaper with an inspiring quote to your phone every morning. Set your preferences once, wake up to motivation daily.

**One-liner:** "Wake up inspired. Fresh AI wallpaper + quote every morning."

**Key differentiator:** Zero effort after setup. Competitors require daily manual work.

---

## 2. Problem & Solution

### The Problem
- People love motivational wallpapers but get bored of the same image
- Changing wallpapers manually is tedious (search → download → crop → settings → set)
- Current solutions are fragmented:
  - AI generators: Great images, no quotes, manual effort
  - Quote apps: Ugly templates, lots of work
  - Shortcuts: Too technical for most users

### The Solution
1. User signs up, picks preferences (topic + style)
2. Every morning, a fresh AI wallpaper with a new quote is delivered
3. Automatically set as phone wallpaper (iOS Shortcut / Android app)
4. Zero daily effort required

---

## 3. Target Market

### Primary Audience
- **Self-improvement enthusiasts** (25-45 years old)
- Active on: Twitter/X, Reddit (r/getdisciplined, r/productivity), YouTube
- Already consume: Stoicism content, productivity podcasts, fitness motivation
- Willing to pay for: Apps that save time and improve their life

### Market Size (TAM → SAM → SOM)
- **TAM:** 500M+ smartphone users interested in self-improvement
- **SAM:** 50M who actively use motivational content
- **SOM (Year 1):** 10,000 paying subscribers = $360K ARR

### Customer Personas

**Persona 1: "Morning Marcus"**
- 32, software engineer
- Reads Ryan Holiday, listens to Huberman
- Wants daily stoic reminders without thinking about it
- Will pay $3/mo for convenience

**Persona 2: "Fitness Fiona"**
- 28, marketing manager
- Goes to gym 5x/week
- Wants motivation on her lock screen
- Shares wallpapers on Instagram stories

---

## 4. Product Features

### MVP (Week 1)
- [x] Web app to generate wallpapers on-demand
- [x] 4 categories: Stoicism, Productivity, Success, Fitness
- [x] 4 styles: Minimalist, Nature, Dark, Vibrant
- [x] Quote overlay on AI-generated image
- [x] Download button

### V1.1 (Week 2-3)
- [ ] Email signup + preference storage
- [ ] Daily email delivery with wallpaper
- [ ] Stripe payment integration
- [ ] Landing page with conversion optimization

### V2 (Month 2)
- [ ] iOS Shortcut for auto-wallpaper setting
- [ ] User dashboard (history, favorites)
- [ ] More categories (Mindfulness, Entrepreneurship, Love)
- [ ] Custom quote upload

### V3 (Month 3+)
- [ ] Android app with auto-wallpaper
- [ ] Widget for home screen
- [ ] Social sharing features
- [ ] Referral program

---

## 5. Revenue Model

### Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 5 wallpapers total (one-time) |
| **Weekly** | $1/mo | 1 new wallpaper per week (4/month) |
| **Daily** | $3/mo | 1 new wallpaper every day (30/month) |
| **Annual** | $24/yr | Daily wallpapers, 33% discount |

### Revenue Projections

**Conservative Scenario (Year 1)**

| Month | Free Users | Paid Users | MRR | ARR |
|-------|------------|------------|-----|-----|
| 1 | 500 | 25 | $75 | - |
| 3 | 2,000 | 150 | $450 | - |
| 6 | 5,000 | 500 | $1,500 | - |
| 12 | 10,000 | 1,500 | $4,500 | $54,000 |

**Optimistic Scenario (Year 1)**

| Month | Free Users | Paid Users | MRR | ARR |
|-------|------------|------------|-----|-----|
| 1 | 1,000 | 50 | $150 | - |
| 3 | 5,000 | 400 | $1,200 | - |
| 6 | 15,000 | 1,500 | $4,500 | - |
| 12 | 50,000 | 5,000 | $15,000 | $180,000 |

### Conversion Assumptions
- Free → Paid conversion: 5-10%
- Monthly churn: 5%
- Average revenue per user: $3/mo

---

## 6. Cost Structure

### Variable Costs (per image)

| Item | Cost |
|------|------|
| AI Image (FLUX Schnell) | $0.003 |
| Email delivery (Resend) | $0.0004 |
| **Total per wallpaper** | **~$0.0035** |

### Monthly Cost by Scale

| Paid Users | Wallpapers/mo | Image Cost | Email Cost | Total |
|------------|---------------|------------|------------|-------|
| 100 | 3,000 | $9 | $1.20 | $10 |
| 1,000 | 30,000 | $90 | $12 | $102 |
| 10,000 | 300,000 | $900 | $120 | $1,020 |

### Fixed Costs (Monthly)

| Item | Cost |
|------|------|
| Vercel Pro (if needed) | $20 |
| Domain | $1 |
| Supabase (if over free tier) | $25 |
| **Total fixed** | **~$50** |

### Unit Economics

| Metric | Value |
|--------|-------|
| Revenue per user | $3.00/mo |
| Cost per user | $0.11/mo (30 wallpapers + emails) |
| **Gross margin** | **96%** |
| CAC target | < $5 |
| LTV (6 mo avg) | $18 |
| LTV:CAC ratio | > 3:1 ✅ |

---

## 7. Go-to-Market Strategy

### Launch Plan (Week 2)

**Day 1-2: Soft Launch**
- Share with friends & family (20-50 users)
- Collect feedback, fix bugs
- Get testimonials

**Day 3: Product Hunt Launch**
- Prepare assets: logo, screenshots, GIF demo
- Write compelling tagline and description
- Schedule for Tuesday 12:01 AM PT (best day)
- Ask friends to upvote + comment (authentically)

**Day 4-5: Social Media Blitz**
- Twitter/X thread: "I built an AI wallpaper app in 1 week"
- Reddit posts: r/SideProject, r/indiehackers, r/productivity, r/stoicism
- Hacker News: "Show HN: Daily Spark"

**Day 6-7: Content Marketing**
- Write blog post: "How I built Daily Spark in 7 days"
- Create TikTok/Reels showing the app
- Reach out to productivity YouTubers

### Marketing Channels (Ongoing)

| Channel | Strategy | Expected CAC |
|---------|----------|--------------|
| Organic social | Daily posts, memes, quotes | $0 |
| Product Hunt | Monthly feature updates | $0 |
| SEO | Blog content, "AI wallpaper" keywords | $0 |
| Reddit | Value-first posts in niche subs | $0 |
| Influencer | Free Pro accounts for review | $2-5 |
| Paid ads | Only if organic works, retargeting | $5-10 |

### Viral Mechanics
- Wallpapers include subtle "Made with Daily Spark" watermark (removable for Pro)
- Share button generates social card with wallpaper preview
- Referral program: Give 1 month free, get 1 month free

---

## 8. Competition

| Competitor | Strengths | Weaknesses | Our Edge |
|------------|-----------|------------|----------|
| Unsplash | Huge library, free | No quotes, manual | Automation + quotes |
| Motivation app | Quotes | Ugly design, manual | AI + beautiful |
| AI art generators | Great images | No quotes, manual | All-in-one, automated |
| Calm/Headspace | Brand, meditation | Expensive, different focus | Focused, cheaper |

**Moat building:**
- First-mover in "automated AI quote wallpaper" niche
- Build email list (owned audience)
- Create habit (daily delivery = sticky)
- Expand to adjacent features (widgets, watch faces)

---

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Low conversion rate | Medium | High | A/B test pricing, add features |
| AI costs spike | Low | Medium | Switch models, cache popular |
| Platform changes (iOS) | Low | High | Diversify to Android, web |
| Copycats | High | Medium | Move fast, build brand |
| User churn | Medium | High | Improve onboarding, add features |

---

## 10. Success Metrics

### North Star Metric
**Daily Active Wallpaper Setters** — Users who actually set the wallpaper

### Key Metrics (Week 2 Launch)
- [ ] 500 signups
- [ ] 50 paid conversions (10% rate)
- [ ] $150 MRR
- [ ] 4.0+ Product Hunt rating

### Key Metrics (Month 3)
- [ ] 5,000 signups
- [ ] 500 paid subscribers
- [ ] $1,500 MRR
- [ ] <5% monthly churn

### Key Metrics (Month 12)
- [ ] 50,000 signups
- [ ] 2,500 paid subscribers
- [ ] $7,500 MRR ($90K ARR)
- [ ] Profitable (revenue > costs)

---

## 11. Roadmap

```
Week 1  ████████████████████ MVP Build
Week 2  ████████████████████ Payment + Launch
Month 2 ████████████████████ iOS Shortcut + Growth
Month 3 ████████████████████ Android + Features
Month 6 ████████████████████ Scale + Optimize
```

### Milestones

| Milestone | Target Date | Success Criteria |
|-----------|-------------|------------------|
| MVP Live | Week 1 | Generates wallpapers |
| First Dollar | Week 2 | 1 paid subscriber |
| Ramen Profitable | Month 3 | $1,000 MRR |
| Full-time Viable | Month 12 | $10,000 MRR |

---

## 12. Ask / Next Steps

### Immediate (This Week)
1. ✅ Build MVP
2. ⬜ Add Replicate billing
3. ⬜ Deploy to Vercel
4. ⬜ Buy domain (dailyspark.app)
5. ⬜ Add Stripe payment

### Week 2
1. ⬜ Set up email delivery (Resend)
2. ⬜ Create landing page
3. ⬜ Launch on Product Hunt
4. ⬜ Post on social media

---

## Appendix: Financial Model

### Break-even Analysis

**Fixed costs:** $50/mo
**Variable cost per user:** $0.11/mo
**Revenue per user:** $3/mo
**Contribution margin:** $2.89/user

**Break-even:** 50 / 2.89 = **18 paid users**

### Scenario: 1,000 Paid Users

```
Revenue:        1,000 × $3    = $3,000
Variable costs: 1,000 × $0.11 = $110
Fixed costs:                  = $50
                              -------
Net profit:                   = $2,840/mo (95% margin)
```

---

*This is a living document. Update as we learn from the market.*
