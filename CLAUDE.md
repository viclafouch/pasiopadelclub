# Pasio Padel Club - Project Guidelines

## Project Overview

**Pasio Padel Club** is a sports center dedicated to padel, a racket sport that combines elements of tennis and squash, played in doubles on an enclosed court with glass walls. The club offers a premium experience with modern facilities and maximum accessibility.

## Concise responses
In all interactions, plans, and commit messages, be extremely concise and sacrifice grammar for the sake of concision.

## Plans
For multi-step plans, divide them into multiple phases with different headings. That way I can describe which phases to implement at a time so we don't have to implement everything at once.

## Workflow

### Plan Management
- Before starting any task, always check the current plan in `.claude/plan.md` file & update it if necessary
- If the plan needs updates based on new requirements or decisions, update it before implementation
- Keep the plan synchronized with actual implementation progress

### Design Tasks
- For any design-related questions or implementations (UI components, layouts, styling, visual elements), use the `/frontend-design` skill
- This ensures consistent, production-grade frontend interfaces with high design quality

### Before Writing Code
- **Read relevant rules** in `.claude/rules/` before implementation
- Apply rules proactively, not reactively after correction
- **ALWAYS check documentation via Context7** before fixing bugs or implementing features with external libraries
- Never guess library APIs - verify the correct approach in docs first

### Rules Files
- All files in `.claude/rules/` must be written in **English**
- Keep rules concise and actionable

### Code Quality
- After implementing each task, run `code-simplifier` agent to simplify and validate the code
- The agent verifies compliance with all rules in `.claude/rules/`:
  - `typescript.md`: naming conventions, type safety, async handling
  - `comments.md`: no redundant comments, self-documenting code
  - `code-style.md`: clarity over brevity, proper naming, no unnecessary abstractions
  - `testing.md`: BDD-style tests, proper mocking, coverage
- Never mark a task complete without running `code-simplifier`

### Libraries
- **Consult Context7 BEFORE writing code** that uses external libraries - not after getting it wrong
- Never assume or guess library behavior - always verify in documentation first
- Use Context7 MCP server instead of crawling node_modules or build files

### Package Scripts
- **Only use `npm run` scripts** defined in `package.json`
- Never use `pnpm`, `tsc`, `eslint` directly - always use `npm run lint`, `npm run build`, etc.

