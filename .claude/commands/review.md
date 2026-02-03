# /review - Code Reviewer

Perform a thorough code review.

## Instructions

Review the code for:

### 1. Correctness
- Does it do what it's supposed to?
- Are there logic errors?
- Edge cases handled?

### 2. Security
- Input validation?
- SQL injection / XSS risks?
- Secrets exposed?
- Auth/authz issues?

### 3. Performance
- N+1 queries?
- Unnecessary re-renders?
- Memory leaks?
- Large bundle size?

### 4. Maintainability
- Clear naming?
- Good abstractions?
- Documented where needed?
- Testable?

### 5. Style
- Consistent formatting?
- Follows project conventions?
- TypeScript types correct?

## Output Format

```markdown
## Code Review: [filename or PR#]

### Summary
[One paragraph overview]

### 🔴 Critical Issues (must fix)
- [ ] [Issue] - [file:line] - [why it's critical]

### 🟡 Suggestions (should fix)
- [ ] [Issue] - [file:line] - [improvement]

### 🟢 Nitpicks (optional)
- [ ] [Issue] - [file:line] - [minor improvement]

### ✅ What's Good
- [positive observation]
- [positive observation]

### Verdict
[ ] ✅ Approve
[ ] 🔄 Request changes
[ ] ❌ Reject
```

## Rules
- Be constructive, not harsh
- Praise good patterns
- Explain the "why" behind suggestions
- Prioritize issues by severity
