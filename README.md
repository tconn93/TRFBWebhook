# 🚀 TRFBWebhook - Facebook Webhook Relay Platform

<div align="center">

**A powerful, privacy-first webhook relay system for Facebook Messenger & Pages**

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Ready-blue.svg)](https://www.postgresql.org/)

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Contributing](#-contributing) • [Documentation](#-documentation)

</div>

---

## 🔒 Privacy First

**We take your privacy seriously.** TRFBWebhook is designed with a privacy-first approach:

- ✅ **No personal data storage** - We don't store message content, user profiles, or conversation data
- ✅ **Relay only** - Webhooks pass through our system and are forwarded to your applications
- ✅ **You own your data** - All webhook data is sent directly to your configured endpoints
- ✅ **Secure authentication** - JWT tokens with bcrypt password hashing
- ✅ **Multi-tenant isolation** - Each user's webhook targets are completely isolated

We process webhooks in real-time and immediately forward them to your applications without storing the payload.

---

## 🎯 What is TRFBWebhook?

TRFBWebhook acts as a smart relay between Facebook's webhook system and your applications. Instead of managing Facebook webhooks directly, you can:

- 📡 **Receive** webhooks from Facebook Messenger & Pages
- 🔄 **Forward** them to multiple target applications simultaneously
- 🎛️ **Manage** all your webhook endpoints from a beautiful dashboard
- 🧪 **Test** webhooks with built-in testing tools
- 👥 **Collaborate** with multi-user support and isolated workspaces

Perfect for developers who need to route Facebook webhooks to multiple services, development/staging/production environments, or want a centralized webhook management solution.

---

## ✨ Features

### Core Functionality
- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 📊 **User Dashboard** - Modern React interface for managing webhooks
- 🎯 **Multi-Target Forwarding** - Send webhooks to multiple endpoints simultaneously
- ⚡ **Real-Time Processing** - Instant webhook forwarding with async processing
- ✅ **Signature Verification** - Validates Facebook webhook signatures for security
- 🧪 **Built-in Testing** - Test your webhook targets with a single click

### Developer Experience
- 🚀 **Easy Setup** - Get running in under 5 minutes
- 📝 **Auto Schema Init** - Database tables created automatically on startup
- 🔄 **Hot Reload** - Development mode with auto-reload
- 📖 **Comprehensive Docs** - Detailed documentation for all components
- 🐳 **Database Ready** - PostgreSQL with connection pooling out of the box

### Enterprise Ready
- 🏢 **Multi-User Support** - Isolated workspaces for each user
- 🔒 **Data Isolation** - Users can only see and manage their own targets
- 📈 **Scalable** - Built on Node.js with PostgreSQL for production loads
- 🛡️ **CORS Enabled** - Ready for cross-origin frontend deployments

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Facebook      │
│   Webhooks      │
└────────┬────────┘
         │
         │ POST /webhook
         ▼
┌─────────────────────────┐
│  TRFBWebhook Backend    │
│  ┌──────────────────┐   │
│  │  Verification    │   │
│  │  & Validation    │   │
│  └────────┬─────────┘   │
│           │              │
│  ┌────────▼─────────┐   │
│  │  Async Forward   │───┼───► Target App 1
│  │  to Targets      │───┼───► Target App 2
│  └──────────────────┘   │───► Target App 3
│                          │
│  ┌──────────────────┐   │
│  │  PostgreSQL DB   │   │
│  │  - Users         │   │
│  │  - Targets       │   │
│  └──────────────────┘   │
└─────────────────────────┘
         ▲
         │ REST API
         │
┌────────┴────────┐
│   React         │
│   Dashboard     │
└─────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Facebook Developer Account

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/TRFBWebhook.git
cd TRFBWebhook
```

### 2. Backend Setup

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and Facebook app details

# Start the server (database schema auto-initializes)
npm start
```

The backend will be running at `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend/webhook
npm install

# Configure API endpoint
cp .env.example .env
# Edit .env if your backend is not at localhost:3001

# Start the development server
npm start
```

The frontend will be running at `http://localhost:3000`

### 4. Configure Facebook Webhooks

1. Go to [Facebook Developers](https://developers.facebook.com/apps/)
2. Create a new app or use existing one
3. Navigate to **Messenger > Settings > Webhooks**
4. Add Callback URL: `https://yourdomain.com/webhook`
5. Enter your Verify Token (matches `FB_VERIFY_TOKEN` in backend `.env`)
6. Subscribe to webhook events you want to receive
7. Subscribe your app to Facebook Pages

### 5. Create Your First Webhook Target

1. Open the dashboard at `http://localhost:3000`
2. Register a new account
3. Click **"+ Add Webhook Target"**
4. Enter your target application's webhook URL
5. Test it with the built-in test button!

---

## 🛠️ Technology Stack

### Backend
- **Node.js** + **Express 5.x** - Fast, unopinionated web framework
- **PostgreSQL** - Reliable relational database with JSONB support
- **JWT** - Stateless authentication tokens
- **bcrypt** - Industry-standard password hashing
- **Axios** - Promise-based HTTP client for forwarding

### Frontend
- **React 19.2** - Modern UI library with latest features
- **React Router 7.x** - Client-side routing
- **CSS Modules** - Scoped styling
- **Fetch API** - Native HTTP requests

### DevOps
- **dotenv** - Environment configuration
- **pg** - PostgreSQL client with connection pooling
- **CORS** - Cross-origin resource sharing

---

## 📁 Project Structure

```
TRFBWebhook/
├── backend/                 # Node.js backend server
│   ├── src/
│   │   ├── db/             # Database connection & schema
│   │   ├── routes/         # API route handlers
│   │   ├── services/       # Business logic
│   │   └── middleware/     # Auth & validation
│   ├── .env.example
│   └── package.json
│
├── frontend/webhook/        # React frontend dashboard
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── services/       # API client
│   │   └── App.js
│   ├── .env.example
│   └── package.json
│
├── CLAUDE.md               # AI assistant context
├── LICENSE
└── README.md              # You are here!
```

---

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Here's how you can help:

### Ways to Contribute

- 🐛 **Report Bugs** - Found a bug? Open an issue with details
- 💡 **Suggest Features** - Have an idea? We'd love to hear it
- 📝 **Improve Documentation** - Help others understand the project better
- 🔧 **Submit Pull Requests** - Fix bugs or add features
- ⭐ **Star the Project** - Show your support!

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable
4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Contribution Guidelines

- ✅ Write clear commit messages
- ✅ Update documentation for new features
- ✅ Ensure your code doesn't break existing functionality
- ✅ Be respectful and constructive in discussions
- ✅ Follow the existing code style and structure

### Good First Issues

Look for issues tagged with `good-first-issue` or `help-wanted` to get started!

---

## 📚 Documentation

- **[Backend API Documentation](backend/README.md)** - Complete API reference
- **[Frontend Development Guide](frontend/webhook/CLAUDE.md)** - React component details
- **[Architecture Overview](CLAUDE.md)** - System design and data flow
- **[Database Schema](backend/README.md#database-schema)** - Table structures and relationships

---

## 🔧 Configuration

### Backend Environment Variables

```env
# Server
PORT=3001

# Facebook App
FB_VERIFY_TOKEN=your_verification_token
FB_APP_SECRET=your_app_secret

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Database
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=trfb_webhook
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

### Frontend Environment Variables

```env
REACT_APP_API_URL=http://localhost:3001
```

---

## 🧪 Testing

### Test Webhook Verification

```bash
curl "http://localhost:3001/webhook?hub.mode=subscribe&hub.verify_token=your_token&hub.challenge=test"
```

### Test Authentication

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## 🚢 Deployment

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set secure `FB_VERIFY_TOKEN` and `FB_APP_SECRET`
- [ ] Use strong database credentials
- [ ] Enable HTTPS (required by Facebook)
- [ ] Set up process manager (PM2, systemd)
- [ ] Configure nginx reverse proxy
- [ ] Set up database backups
- [ ] Monitor application logs
- [ ] Set up error tracking (Sentry, etc.)

### Recommended Stack

- **Server**: Ubuntu 20.04+ / Debian 11+
- **Process Manager**: PM2 or systemd
- **Reverse Proxy**: nginx with Let's Encrypt SSL
- **Database**: PostgreSQL 12+ with regular backups
- **Monitoring**: PM2 monitoring or custom solution

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -h your_host -U your_user -d trfb_webhook

# Initialize schema manually
node backend/src/db/init.js
```

### Webhook Verification Fails

- Verify `FB_VERIFY_TOKEN` matches in both Facebook and `.env`
- Ensure your server is accessible via HTTPS
- Check server logs for details

### Frontend Can't Connect to Backend

- Verify `REACT_APP_API_URL` in frontend `.env`
- Check CORS is enabled on backend
- Ensure backend is running on the correct port

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ for the developer community
- Powered by [Node.js](https://nodejs.org/), [React](https://reactjs.org/), and [PostgreSQL](https://www.postgresql.org/)
- Inspired by the need for better webhook management tools

---

## 📞 Support

- 📧 **Email**: [Open an issue](https://github.com/yourusername/TRFBWebhook/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/TRFBWebhook/discussions)
- 🐛 **Bug Reports**: [Issue Tracker](https://github.com/yourusername/TRFBWebhook/issues)

---

<div align="center">

**Made with ☕ and 💻 by developers, for developers**

⭐ **Star this repo if you find it useful!** ⭐

[Report Bug](https://github.com/yourusername/TRFBWebhook/issues) • [Request Feature](https://github.com/yourusername/TRFBWebhook/issues) • [Contribute](CONTRIBUTING.md)

</div>
