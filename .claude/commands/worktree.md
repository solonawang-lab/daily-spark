# /worktree - Parallel Development

Use git worktrees for working on multiple features/fixes simultaneously.

## Commands

### Create a new worktree
```bash
# For a new feature
git worktree add -b feat/feature-name ../daily-spark-feature-name main

# For a fix
git worktree add -b fix/issue-123 ../daily-spark-fix-123 main
```

### List worktrees
```bash
git worktree list
```

### Remove a worktree (after merging)
```bash
git worktree remove ../daily-spark-feature-name
# or force remove
git worktree remove --force ../daily-spark-feature-name
```

## Workflow

### 1. Start parallel work
```bash
# Create worktree for feature A
git worktree add -b feat/add-payments ../daily-spark-payments main
cd ../daily-spark-payments
npm install

# Create worktree for feature B (in another terminal)
git worktree add -b feat/add-auth ../daily-spark-auth main
cd ../daily-spark-auth
npm install
```

### 2. Work independently
Each worktree is a separate directory:
- `/Users/solona/projects/daily-spark` (main)
- `/Users/solona/projects/daily-spark-payments` (feature A)
- `/Users/solona/projects/daily-spark-auth` (feature B)

### 3. Create PRs from each
```bash
cd ../daily-spark-payments
git push origin feat/add-payments
gh pr create --fill

cd ../daily-spark-auth
git push origin feat/add-auth
gh pr create --fill
```

### 4. Clean up after merge
```bash
cd /Users/solona/projects/daily-spark
git worktree remove ../daily-spark-payments
git worktree remove ../daily-spark-auth
git branch -d feat/add-payments
git branch -d feat/add-auth
```

## Benefits
- Work on multiple features without stashing
- Each worktree has its own node_modules
- No context switching between branches
- Can run multiple dev servers on different ports

## Tips
- Use different ports: `PORT=3001 npm run dev`
- Name worktree dirs clearly
- Clean up after merging to avoid clutter
