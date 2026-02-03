# Daily Spark ✨

> Wake up to a fresh, AI-generated wallpaper with an inspiring quote every morning.

[![CI](https://github.com/YOUR_USERNAME/daily-spark/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/daily-spark/actions/workflows/ci.yml)

**Project #1** of the 26-in-52 indie hacker challenge.

## Features

- 🎨 **4 Visual Styles:** Minimalist, Nature, Dark, Vibrant
- 📚 **4 Quote Categories:** Stoicism, Productivity, Success, Fitness
- 🤖 **AI-Generated Images:** Powered by FLUX Schnell via Replicate
- 📱 **Phone-Optimized:** 1170x2532 resolution (iPhone 14 Pro)
- 💾 **One-Click Download:** Save directly to your phone

## Quick Start

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/daily-spark.git
cd daily-spark

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 |
| Styling | Tailwind CSS |
| AI Images | Replicate (FLUX Schnell) |
| Image Processing | node-canvas |
| Hosting | Vercel |

## Project Structure

```
daily-spark/
├── app/
│   ├── page.tsx              # Main UI
│   ├── layout.tsx            # Root layout
│   └── api/generate/         # Generation API
├── lib/
│   ├── quotes.ts             # Quote library
│   ├── styles.ts             # Style configs
│   ├── replicate.ts          # AI image generation
│   └── overlay.ts            # Text overlay
├── data/
│   └── quotes.json           # 40 curated quotes
├── .github/
│   ├── workflows/ci.yml      # CI pipeline
│   ├── pull_request_template.md
│   └── ISSUE_TEMPLATE/
├── BUSINESS-PLAN.md          # Revenue & growth strategy
├── DEPLOYMENT-PLAN.md        # Hosting & China support
├── MVP-SPEC.md               # Product specification
└── CONTRIBUTING.md           # Development workflow
```

## Environment Variables

```bash
# Required
REPLICATE_API_TOKEN=xxx       # Get from replicate.com

# Development
USE_MOCK_IMAGES=true          # Use placeholder images
```

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for branching workflow and PR guidelines.

## Roadmap

- [x] MVP: On-demand generation
- [ ] User accounts & preferences
- [ ] Daily email delivery
- [ ] Stripe payments
- [ ] iOS Shortcut for auto-wallpaper
- [ ] Android app

## License

MIT

---

Built with ❤️ by Lei & Solona
