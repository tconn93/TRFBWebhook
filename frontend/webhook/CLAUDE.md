# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React web application for handling webhooks, bootstrapped with Create React App. The project is part of a larger TRFBWebhook system and serves as the frontend interface.

## Technology Stack

- **Framework**: React 19.2.0
- **Language**: JavaScript (no TypeScript configuration)
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Routing**: React Router DOM 7.x
- **Testing**: Jest with React Testing Library (@testing-library/react, @testing-library/jest-dom)

## Development Commands

### Start Development Server
```bash
npm start
```
Runs the app in development mode at http://localhost:3000 with hot reloading.

### Run Tests
```bash
npm test
```
Launches Jest test runner in interactive watch mode.

### Build for Production
```bash
npm run build
```
Creates an optimized production build in the `/build` folder.

## Project Structure

```
src/
├── components/
│   ├── Landing.js          # Landing page with feature showcase
│   ├── Landing.css         # Landing page styles
│   ├── Login.js            # Login form component
│   ├── Register.js         # Registration form component
│   ├── Auth.css            # Shared authentication styles
│   ├── Dashboard.js        # User dashboard (authenticated)
│   └── Dashboard.css       # Dashboard styles
├── App.js                  # Main routing configuration
├── App.css                 # Global app styles
├── index.js                # Application entry point
├── index.css               # Global base styles
└── setupTests.js           # Jest test configuration
```

## Architecture Notes

### Routing Structure
- **`/`** - Landing page with feature showcase and CTAs
- **`/login`** - User login with form validation
- **`/register`** - New user registration
- **`/dashboard`** - Protected dashboard (requires authentication)

### Authentication
- Frontend-only mock authentication using localStorage
- `isAuthenticated`, `userEmail`, and `userName` stored in localStorage
- Dashboard component redirects to login if not authenticated
- Ready to integrate with backend API endpoints

### Design System
- Bold, colorful gradient-based design
- Purple/pink gradient backgrounds (#667eea → #764ba2)
- Features highlighted: Real-time webhooks, Easy integration, Security/Reliability, Privacy-first approach
- Fully responsive with mobile-optimized layouts
- Smooth animations and hover effects throughout

### Key Features Showcased
1. Real-time webhook processing
2. Simple integration setup
3. Enterprise security and 99.9% uptime
4. No personal data storage (privacy-first)

### Component Architecture
- Each page is a self-contained component with its own CSS
- Shared authentication styling in `Auth.css` for Login/Register
- React Router handles client-side navigation
- localStorage used for simple session management
