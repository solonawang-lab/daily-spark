# /plan - Planning Mode

Before writing any code, create a detailed plan.

## Instructions

1. **Understand the task** - Restate what needs to be done
2. **Break it down** - List specific subtasks
3. **Identify files** - Which files need to be created/modified
4. **Consider edge cases** - What could go wrong?
5. **Estimate effort** - How long will each step take?

## Output Format

```markdown
## Plan: [Task Name]

### Goal
[One sentence describing the end result]

### Steps
1. [ ] Step 1 - [description] (~X min)
2. [ ] Step 2 - [description] (~X min)
...

### Files to Modify
- `path/to/file.ts` - [what changes]
- `path/to/new-file.ts` - [create new]

### Edge Cases
- [potential issue 1]
- [potential issue 2]

### Dependencies
- [any packages to install]
- [any APIs to set up]

### Questions
- [anything unclear before starting]
```

## Rules
- Do NOT write code yet
- Ask clarifying questions if needed
- Get user approval before proceeding to implementation
