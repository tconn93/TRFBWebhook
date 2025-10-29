# AGENTS.md

This file guides agentic coding agents working in the TRFBWebhook repository.

## Build/Lint/Test Commands

### Backend (cd backend)
- Install dependencies: `npm install`
- Development server: `npm run dev` (uses --watch)
- Production server: `npm start`
- Tests: No tests configured (`npm test` errors). Add Jest: `npm i -D jest`, script `"test": "jest"`.
- Single test: Once Jest added, `npm test -- --testNamePattern="test name" path/to/file.test.js`
- Lint: No ESLint setup. Add: `npm i -D eslint`, init with `npx eslint --init`, script `"lint": "eslint src/**/*.js"`. Run `npm run lint`.
- Format: No Prettier. Add if needed.

### Frontend (cd frontend/webhook)
- Install dependencies: `npm install`
- Development server: `npm start`
- Build: `npm run build`
- Tests: `npm test` (uses Jest + React Testing Library)
- Single test: `npm test -- --testNamePattern="TestComponent renders"` or `npm test -- src/components/Login.test.js`
- Lint: Uses built-in ESLint (react-app config). Run manually: `npx eslint src/`
- Deploy: `npm run deploy` (SCP to server)

## Code Style Guidelines

### Backend (Node.js/Express)
- **Imports**: Use CommonJS (`require`/`module.exports`). No ES modules.
- **Formatting**: 2-space indentation. Semicolons required. Single quotes for strings.
- **Types**: JavaScript (no TypeScript). Use JSDoc for documentation.
- **Naming**: camelCase for variables/functions (e.g., `getActiveTargets`). UpperCamelCase for classes (rare).
- **Error Handling**: Use try-catch for async operations. Log errors with `console.error`. Return 500 for server errors.
- **Conventions**: Async/await over callbacks/promises. Validate inputs (e.g., req.body). Use environment variables for secrets.
- **Comments**: JSDoc for routes/services. Inline comments for complex logic.

### Frontend (React 19)
- **Imports**: ES6 (`import`/`export`). Group: React, third-party, local.
- **Formatting**: 2-space indentation (Create React App default). Semicolons. JSX self-closing tags.
- **Types**: No TypeScript. PropTypes if needed for components.
- **Naming**: camelCase for components/files (e.g., `Login.js`). kebab-case for CSS classes.
- **Error Handling**: Error boundaries for components. Try-catch in event handlers.
- **Conventions**: Functional components with hooks. Follow React Router patterns. Mock auth with localStorage (integrate with backend API).
- **Comments**: Minimal; use for complex logic. No inline comments unless necessary.

### General
- Follow existing patterns: Backend uses Express routers; Frontend uses React Router.
- Security: Never log/hardcode secrets. Use bcrypt for passwords, JWT for auth.
- No emojis or unnecessary comments unless requested.
- Verify changes: Run lint/test after edits. Check for breaking changes in webhook forwarding."
