# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TRFBWebhook is a complete Facebook webhook relay application for Tyler.rest. It consists of:
- **Backend**: Node.js/Express server that receives Facebook webhooks and forwards them to configured target applications
- **Frontend**: React-based dashboard for managing webhook targets and user authentication

## Repository Structure

```
TRFBWebhook/
├── backend/            # Node.js webhook relay server
│   ├── src/
│   │   ├── index.js                # Main server entry point
│   │   ├── db/
│   │   │   ├── connection.js      # PostgreSQL connection pool
│   │   │   └── init.js            # Database schema initialization
│   │   ├── routes/
│   │   │   ├── webhook.js         # Facebook webhook endpoints
│   │   │   ├── targets.js         # Target management API
│   │   │   └── auth.js            # Authentication endpoints
│   │   ├── services/
│   │   │   ├── forwarder.js       # Webhook forwarding logic
│   │   │   ├── targetManager.js   # Target storage (PostgreSQL)
│   │   │   └── userManager.js     # User management (PostgreSQL)
│   │   └── middleware/
│   │       └── auth.js            # JWT authentication
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── frontend/
│   └── webhook/        # React frontend application
│       ├── src/
│       │   ├── components/
│       │   │   ├── Landing.js      # Landing page
│       │   │   ├── Login.js        # Authentication
│       │   │   ├── Register.js     # User registration
│       │   │   └── Dashboard.js    # User dashboard
│       │   └── App.js              # Main routing
│       ├── CLAUDE.md              # Frontend-specific guidance
│       └── package.json
└── CLAUDE.md          # This file
```

## Technology Stack

- **Backend**: Node.js + Express 5.x
  - PostgreSQL database for user and target storage
  - JWT authentication with bcrypt password hashing
  - Axios for HTTP forwarding
  - Facebook webhook verification and signature validation
- **Frontend**: React 19.2 with Create React App
  - React Router DOM 7.x
  - Jest + React Testing Library
- **Database**: PostgreSQL with connection pooling
- **Deployment**: SCP to webhost at fb.tyler.rest

## Development Workflow

### Backend Development

All backend commands must be run from `backend/` directory:

```bash
cd backend

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env
# Edit .env and set FB_VERIFY_TOKEN and FB_APP_SECRET

# Start development server (http://localhost:3001)
npm run dev

# Start production server
npm start
```

**Required Environment Variables:**
- `PORT` - Server port (default: 3001)
- `FB_VERIFY_TOKEN` - Custom token for Facebook webhook verification
- `FB_APP_SECRET` - Facebook App Secret for request signature validation
- `JWT_SECRET` - Secret key for JWT token signing
- `JWT_EXPIRES_IN` - Token expiration time (default: 7d)
- `DB_HOST` - PostgreSQL database host
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name (default: trfb_webhook)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password

**Database Setup:**
```bash
# Create PostgreSQL database
createdb trfb_webhook

# Schema is auto-initialized on first server start
# Or manually run:
node src/db/init.js
```

### Frontend Development

All frontend commands must be run from `frontend/webhook/` directory:

```bash
cd frontend/webhook

# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm start

# Run tests
npm test

# Build for production
npm run build

# Deploy to production server
npm run deploy
```

**Note**: The `deploy` script uses SCP to deploy to `tcon@webhost:/var/www/fb.tyler.rest/html/`. Ensure you have SSH access configured before deploying.

## Architecture Notes

### Backend: Webhook Relay Flow

1. **Webhook Verification (GET /webhook)**
   - Facebook sends verification request during setup
   - Server validates `hub.verify_token` against `FB_VERIFY_TOKEN`
   - Returns challenge token to complete verification

2. **Webhook Reception (POST /webhook)**
   - Receives webhook events from Facebook
   - Validates request signature using `FB_APP_SECRET`
   - Responds immediately with 200 OK (required by Facebook)
   - Processes and forwards asynchronously

3. **Webhook Forwarding**
   - Retrieves all active targets from PostgreSQL database
   - Forwards payload to each target URL via HTTP POST
   - Includes custom headers: `X-Forwarded-By`, `X-Original-Source`
   - Logs forwarding results

4. **Authentication Flow**
   - User registers via `POST /api/auth/register`
   - Password hashed with bcrypt (10 rounds)
   - Login returns JWT token via `POST /api/auth/login`
   - All target management routes require authentication
   - Token passed in `Authorization: Bearer <token>` header

5. **Target Management API (REST - Protected)**
   - `GET /api/targets` - List user's targets
   - `POST /api/targets` - Create new target
   - `PUT /api/targets/:id` - Update target
   - `DELETE /api/targets/:id` - Delete target
   - `POST /api/targets/:id/test` - Send test webhook

**Database Schema:**
- `users` - User accounts with bcrypt passwords
- `webhook_targets` - Webhook targets with user_id foreign key
- Indexes on email, user_id, active status

**Key Files:**
- `backend/src/routes/webhook.js` - Facebook webhook endpoints
- `backend/src/routes/auth.js` - Authentication endpoints
- `backend/src/routes/targets.js` - Protected target management
- `backend/src/services/forwarder.js` - Forwarding logic
- `backend/src/services/userManager.js` - User CRUD (PostgreSQL)
- `backend/src/services/targetManager.js` - Target CRUD (PostgreSQL)
- `backend/src/middleware/auth.js` - JWT verification
- `backend/src/db/connection.js` - PostgreSQL connection pool
- `backend/src/db/init.js` - Schema initialization

### Frontend: Dashboard UI

- Mock authentication currently implemented with localStorage
- Stores: `isAuthenticated`, `userEmail`, `userName`
- Dashboard redirects to login if not authenticated
- **Ready for backend integration** - replace localStorage with backend API calls

### Frontend Routes
- `/` - Landing page with feature showcase
- `/login` - User login form
- `/register` - User registration form
- `/dashboard` - Protected user dashboard (manage webhook targets)

### Design System
- Bold gradient-based UI (purple/pink: #667eea → #764ba2)
- Fully responsive mobile-first design
- Smooth animations and hover effects
- Feature highlights: real-time webhooks, easy integration, security, privacy

## Integration Points

### Frontend ↔ Backend Integration (TODO)

Currently, the frontend and backend are separate. To connect them:

1. **Update Frontend to use Backend API**
   - Replace mock localStorage auth with API calls
   - Add API client for target management (`/api/targets`)
   - Display webhook targets in Dashboard component
   - Add UI for creating/editing/deleting targets

2. **Add Authentication to Backend**
   - Implement user registration and login endpoints
   - Add JWT or session-based authentication
   - Protect `/api/targets` routes with authentication middleware
   - Store user-specific webhook targets

3. **CORS Configuration**
   - Backend already has CORS enabled
   - Configure allowed origins for production

### Facebook App Setup

1. Create Facebook App at https://developers.facebook.com/apps/
2. Go to Messenger > Settings > Webhooks
3. Add Callback URL: `https://yourdomain.com/webhook`
4. Enter Verify Token (must match `FB_VERIFY_TOKEN` in backend `.env`)
5. Subscribe to webhook events (messages, messaging_postbacks, etc.)
6. Subscribe app to Facebook Pages you want to monitor

## Deployment

### Frontend
- **URL**: https://fb.tyler.rest
- **Method**: SCP via `npm run deploy` from frontend/webhook directory
- **Server**: tcon@webhost
- **Path**: /var/www/fb.tyler.rest/html/

### Backend
- **Server**: tcon@webhost (recommended)
- **Process Manager**: PM2 or systemd recommended
- **Reverse Proxy**: nginx with SSL (HTTPS required by Facebook)
- **Port**: 3001 (default, configure in `.env`)

**Backend Deployment Steps:**
1. Copy backend files to server
2. Run `npm install --production`
3. Create `.env` with production values
4. Set up nginx reverse proxy with SSL
5. Start with PM2: `pm2 start src/index.js --name trfb-webhook`
6. Configure Facebook webhook URL to point to your domain

Ensure SSH keys are set up for passwordless deployment.

## Common Development Tasks

### Testing the Backend Locally

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test webhook verification:**
   ```bash
   curl "http://localhost:3001/webhook?hub.mode=subscribe&hub.verify_token=your_verify_token&hub.challenge=test123"
   ```

3. **Create a webhook target:**
   ```bash
   curl -X POST http://localhost:3001/api/targets \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Webhook",
       "url": "https://webhook.site/unique-url",
       "active": true
     }'
   ```

4. **Test webhook forwarding:**
   Use webhook.site or similar service to create a test endpoint, then send a test webhook.

### Exposing Local Server to Facebook

For development, use ngrok to expose your local server:
```bash
ngrok http 3001
# Use the HTTPS URL in Facebook webhook configuration
```

## Additional Documentation

- Backend API details: `backend/README.md`
- Frontend development: `frontend/webhook/CLAUDE.md`
