# Daily Spark - MVP Spec (v1)

**Project:** #1 of 26
**Scope:** On-demand wallpaper generation (no accounts, no automation)

---

## 🎯 V1 Goal

Validate that people want AI-generated motivational wallpapers.

**Core flow:**
```
[Pick Category] → [Pick Style] → [Generate] → [Download Wallpaper]
```

That's it. No signup. No daily emails. Just generate and download.

---

## ✅ V1 Features

| Feature | Details |
|---------|---------|
| Category picker | Stoicism, Productivity, Success, Fitness |
| Style picker | Minimalist, Nature, Dark, Vibrant |
| Generate button | Creates AI image + quote overlay |
| Download | iPhone-sized wallpaper (1170x2532) |

### Out of Scope (V1)
- User accounts
- Daily automation
- Email delivery
- Payment
- History/favorites

---

## 🛠 Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | Next.js + Tailwind |
| AI Images | Replicate (SDXL) or DALL-E |
| Quotes | Curated JSON file |
| Hosting | Vercel (free) |

### API Costs
- Replicate SDXL: ~$0.003/image
- DALL-E 3: ~$0.04/image
- **Recommendation:** Start with Replicate (cheaper for testing)

---

## 📐 Simple Data Flow

```
1. User selects: category + style
2. Frontend calls: POST /api/generate
3. Backend:
   - Pick random quote from category
   - Generate image via Replicate
   - Overlay quote on image
   - Return image URL
4. User downloads wallpaper
```

---

## 🎨 Generation Details

### Image Prompt Template
```
{style_prompt}, phone wallpaper, 9:16 aspect ratio,
{category_theme}, minimal text space in center,
high quality, aesthetic, 4k
```

### Style Prompts
| Style | Prompt |
|-------|--------|
| Minimalist | soft gradient background, geometric shapes, muted pastel colors, clean |
| Nature | mountain landscape, sunset, atmospheric, serene, misty |
| Dark | deep black background, subtle neon glow, moody, elegant |
| Vibrant | bold colors, energetic, abstract shapes, dynamic |

### Quote Overlay
- Font: Inter Bold (or system sans-serif)
- Color: White with subtle shadow (or adaptive)
- Position: Center
- Max width: 80% of image
- Author: Smaller, below quote

---

## 📁 Project Structure

```
daily-spark/
├── app/
│   ├── page.tsx              # Main UI (picker + generate)
│   ├── api/
│   │   └── generate/route.ts # Generate wallpaper API
│   └── layout.tsx
├── components/
│   ├── CategoryPicker.tsx
│   ├── StylePicker.tsx
│   ├── GenerateButton.tsx
│   └── WallpaperPreview.tsx
├── lib/
│   ├── replicate.ts          # AI image generation
│   ├── quotes.ts             # Quote library
│   └── overlay.ts            # Text overlay on image
├── data/
│   └── quotes.json           # Curated quotes by category
└── public/
    └── fonts/                # Custom fonts if needed
```

---

## 📝 Quotes Library

```json
{
  "stoicism": [
    { "text": "The obstacle is the way.", "author": "Marcus Aurelius" },
    { "text": "We suffer more in imagination than in reality.", "author": "Seneca" }
  ],
  "productivity": [
    { "text": "Done is better than perfect.", "author": "Sheryl Sandberg" },
    { "text": "Focus on being productive, not busy.", "author": "Tim Ferriss" }
  ],
  "success": [
    { "text": "The only way to do great work is to love what you do.", "author": "Steve Jobs" }
  ],
  "fitness": [
    { "text": "The body achieves what the mind believes.", "author": "Unknown" }
  ]
}
```

---

## 📅 Build Plan

| Task | Time |
|------|------|
| Scaffold Next.js + Tailwind | 30 min |
| UI: Category + Style pickers | 1 hr |
| Quotes JSON library | 30 min |
| Replicate integration | 1 hr |
| Quote overlay (canvas/sharp) | 2 hr |
| Generate API endpoint | 1 hr |
| Download flow | 30 min |
| Polish + responsive | 1 hr |
| **Total** | ~8 hours |

---

## ✅ Definition of Done

- [ ] User can pick category (4 options)
- [ ] User can pick style (4 options)
- [ ] Click generate → see loading state
- [ ] Wallpaper appears with quote overlaid
- [ ] Download button saves to phone
- [ ] Works on mobile Safari/Chrome
- [ ] Deployed to Vercel

---

## 🚀 After V1 (if validated)

- Add email capture for "daily delivery" waitlist
- User accounts + saved preferences
- Daily automation (cron job + email)
- Paid tier ($3/mo for daily)
- iOS Shortcut for true automation
