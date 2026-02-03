# Contributing to Daily Spark

## Branching Strategy

```
main (production)
  │
  ├── feat/feature-name    # New features
  ├── fix/bug-description  # Bug fixes
  ├── docs/what-changed    # Documentation
  └── refactor/what        # Code refactoring
```

### Branch Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/short-description` | `feat/add-stripe-payment` |
| Bug fix | `fix/short-description` | `fix/download-button-mobile` |
| Docs | `docs/short-description` | `docs/update-readme` |
| Refactor | `refactor/short-description` | `refactor/extract-api-utils` |

## Workflow

### 1. Create a Branch
```bash
git checkout main
git pull origin main
git checkout -b feat/my-feature
```

### 2. Make Changes
- Write code
- Test locally (`npm run dev`)
- Commit with clear messages

### 3. Commit Message Format
```
type: short description

- Detail 1
- Detail 2
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `style`, `test`, `chore`

**Examples:**
```
feat: add Stripe checkout integration

- Add Stripe SDK
- Create checkout API route
- Add pricing page component
```

```
fix: wallpaper download not working on Safari

- Use blob URL instead of data URL
- Add Safari-specific handling
```

### 4. Push & Create PR
```bash
git push origin feat/my-feature
# Then create PR on GitHub
```

### 5. PR Review Checklist
Before requesting review:
- [ ] Code runs without errors
- [ ] Tested on mobile and desktop
- [ ] No `console.log` left in code
- [ ] No hardcoded secrets
- [ ] PR description is clear

### 6. Merge
- Squash and merge to `main`
- Delete the branch after merge

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## Environment Setup

Copy `.env.example` to `.env.local` and fill in:
```
REPLICATE_API_TOKEN=xxx
USE_MOCK_IMAGES=true  # Set to false for real AI images
```

## Code Style

- Use TypeScript
- Use Tailwind for styling
- Keep components small and focused
- Extract reusable logic to `/lib`

## Questions?

Open an issue or ask in Discord.
