# CLAUDE.md - Daily Spark Project Instructions

## Project Overview
Daily Spark is an AI-powered wallpaper generator with inspiring quotes. Built with Next.js 16, Tailwind CSS, and Replicate API.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **AI Images:** Replicate (FLUX Schnell)
- **Image Processing:** node-canvas
- **Language:** TypeScript

## Project Structure
```
app/                    # Next.js app router
├── page.tsx           # Main UI
├── layout.tsx         # Root layout
└── api/generate/      # API routes

lib/                   # Utilities
├── quotes.ts          # Quote library
├── styles.ts          # Style configs
├── replicate.ts       # AI image generation
└── overlay.ts         # Text overlay on images

data/
└── quotes.json        # Curated quotes by category

components/            # React components (create as needed)
```

## Commands
```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

## Key Files to Know
- `app/page.tsx` — Main UI with category/style pickers
- `app/api/generate/route.ts` — Wallpaper generation API
- `lib/replicate.ts` — AI image generation (has mock mode)
- `lib/overlay.ts` — Quote text overlay using canvas
- `data/quotes.json` — Quote library (40 quotes, 4 categories)

## Environment Variables
```bash
REPLICATE_API_TOKEN=xxx    # Required for AI images
USE_MOCK_IMAGES=true       # Set false for real AI
```

## Code Style
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use Tailwind for all styling (no CSS files)
- Keep components small and focused
- Extract reusable logic to `/lib`

## Git Workflow
```bash
# Always branch from main
git checkout -b feat/feature-name  # or fix/, docs/, refactor/
git add . && git commit -m "feat: description"
git push origin feat/feature-name
gh pr create --fill
```

## API Design
- All API routes in `app/api/`
- Use Next.js Route Handlers
- Return JSON with proper error handling
- Example response: `{ imageUrl, quote, author, category, style }`

## Testing Checklist
Before committing:
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] Tested in browser (desktop + mobile viewport)
- [ ] No console errors
- [ ] No hardcoded secrets

## Common Tasks

### Add a new quote category
1. Add quotes to `data/quotes.json`
2. Update `Category` type in `lib/quotes.ts`
3. Add emoji in `categoryEmojis`
4. Update UI in `app/page.tsx`

### Add a new visual style
1. Add style config to `lib/styles.ts`
2. Add prompt and colors
3. Update UI in `app/page.tsx`

### Change AI model
Edit `lib/replicate.ts` — change the model ID in `replicate.run()`

## Troubleshooting
- **Build fails on canvas:** May need system deps: `brew install pkg-config cairo pango libpng jpeg giflib librsvg`
- **Replicate 402:** Need to add billing at replicate.com/account/billing
- **Images not loading:** Check if `USE_MOCK_IMAGES=true` in `.env.local`
