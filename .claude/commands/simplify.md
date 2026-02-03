# /simplify - Code Simplifier

Review and simplify the specified code.

## Instructions

1. **Read the code** - Understand what it does
2. **Identify complexity** - Find overly complex patterns
3. **Simplify** - Reduce complexity while maintaining functionality

## What to Look For

- **Unnecessary abstractions** - Remove if not needed
- **Deep nesting** - Flatten with early returns
- **Repeated code** - Extract to functions
- **Complex conditionals** - Simplify boolean logic
- **Long functions** - Break into smaller pieces
- **Unused code** - Remove dead code
- **Over-engineering** - YAGNI (You Ain't Gonna Need It)

## Output Format

```markdown
## Simplification Report: [filename]

### Current Issues
1. [Issue] - Line X-Y
2. [Issue] - Line X-Y

### Proposed Changes
[Show before/after for each change]

### Impact
- Lines removed: X
- Complexity reduced: [description]
- Readability: [improved/unchanged]
```

## Rules
- Preserve functionality exactly
- Don't change public APIs without asking
- Explain WHY each change improves the code
- Show diff or before/after
