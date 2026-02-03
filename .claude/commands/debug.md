# /debug - Systematic Debugging

Systematically debug an issue.

## Instructions

### 1. Reproduce
- Get exact steps to reproduce
- Note environment (browser, Node version, etc.)

### 2. Isolate
- Find the smallest code that shows the bug
- Check if it's in our code or a dependency

### 3. Investigate
- Read error messages carefully
- Check logs (browser console, server logs)
- Add strategic console.logs or breakpoints

### 4. Hypothesize
- What could cause this behavior?
- List possible causes ranked by likelihood

### 5. Test
- Test each hypothesis
- Change one thing at a time

### 6. Fix
- Implement the smallest fix
- Verify fix doesn't break other things

## Output Format

```markdown
## Debug Report: [Issue Description]

### Reproduction Steps
1. [step]
2. [step]
3. See error: [error message]

### Environment
- Browser: [if applicable]
- Node: [version]
- OS: [os]

### Investigation Log
- [timestamp] Checked X - found Y
- [timestamp] Added log to Z - saw W

### Root Cause
[Explanation of what's actually wrong]

### Fix
[Code change that fixes it]

### Verification
- [ ] Original bug is fixed
- [ ] No new bugs introduced
- [ ] Tests pass
```

## Common Patterns

### React/Next.js
- Check hydration mismatches
- Check useEffect dependencies
- Check for missing keys in lists

### API Issues
- Check request/response in Network tab
- Verify env variables are set
- Check CORS headers

### Build Issues
- Clear .next folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`
