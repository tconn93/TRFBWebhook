# TRFBWebhook Backend

Facebook Webhook Relay Server - Receives webhooks from Facebook and forwards them to any configured target applications.

## Overview

This backend service acts as a webhook relay/proxy:
1. Receives webhooks from Facebook Messenger/Pages
2. Verifies Facebook webhook requests
3. Forwards events to one or more configured target applications
4. Provides API for managing webhook targets

## Quick Start

### Installation

```bash
npm install
```

### Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and set your configuration:
```env
PORT=3001

# Facebook Configuration
FB_VERIFY_TOKEN=your_custom_verify_token
FB_APP_SECRET=your_facebook_app_secret

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# PostgreSQL Database
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=trfb_webhook
DB_USER=your_database_user
DB_PASSWORD=your_database_password
```

3. Set up PostgreSQL database:
   - Create a database named `trfb_webhook` (or your chosen name)
   - The schema will be automatically initialized on first run
   - Alternatively, run the initialization script manually:
   ```bash
   node src/db/init.js
   ```

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3001` (or the port you configured).

## Facebook Setup

### 1. Create a Facebook App

1. Go to https://developers.facebook.com/apps/
2. Create a new app (Business > Messenger)
3. Note your App Secret from Settings > Basic

### 2. Configure Webhooks

1. In your Facebook App, go to Messenger > Settings
2. In the Webhooks section, click "Add Callback URL"
3. Enter your callback URL: `https://yourdomain.com/webhook`
4. Enter your Verify Token (must match `FB_VERIFY_TOKEN` in `.env`)
5. Subscribe to the events you want to receive

### 3. Subscribe to a Page

1. In Webhooks section, click "Add or remove Pages"
2. Select the page(s) you want to receive webhooks from
3. Subscribe to webhook fields (messages, messaging_postbacks, etc.)

## API Endpoints

### Webhook Endpoints

#### `GET /webhook`
Facebook webhook verification endpoint. Facebook calls this to verify your webhook URL.

**Query Parameters:**
- `hub.mode`: Should be "subscribe"
- `hub.verify_token`: Your verification token
- `hub.challenge`: Challenge string to return

#### `POST /webhook`
Receives webhook events from Facebook and forwards them to configured targets.

**Headers:**
- `x-hub-signature-256`: Facebook request signature (verified if FB_APP_SECRET is set)

### Target Management API

#### `GET /api/targets`
Get all configured webhook targets.

**Response:**
```json
{
  "success": true,
  "count": 2,
  "targets": [...]
}
```

#### `GET /api/targets/:id`
Get a specific target by ID.

#### `POST /api/targets`
Create a new webhook target.

**Body:**
```json
{
  "name": "My Application",
  "url": "https://myapp.com/webhook",
  "active": true,
  "headers": {
    "Authorization": "Bearer token123"
  },
  "timeout": 30000
}
```

#### `PUT /api/targets/:id`
Update an existing target.

**Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "url": "https://newurl.com/webhook",
  "active": false,
  "headers": {},
  "timeout": 15000
}
```

#### `DELETE /api/targets/:id`
Delete a webhook target.

#### `POST /api/targets/:id/test`
Send a test webhook to a target.

### Health Check

#### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-27T12:00:00.000Z"
}
```

## Architecture

```
src/
├── index.js                 # Main application entry point
├── db/
│   ├── connection.js       # PostgreSQL connection pool
│   └── init.js             # Database schema initialization
├── routes/
│   ├── webhook.js          # Facebook webhook endpoints
│   ├── targets.js          # Target management API
│   └── auth.js             # Authentication endpoints
├── services/
│   ├── forwarder.js        # Webhook forwarding logic
│   ├── targetManager.js    # Target storage (PostgreSQL)
│   └── userManager.js      # User management (PostgreSQL)
└── middleware/
    └── auth.js             # JWT authentication middleware
```

### Database Schema

**Users Table:**
- `id` - Unique user identifier
- `email` - User email (unique)
- `name` - User's full name
- `password` - Bcrypt hashed password
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

**Webhook Targets Table:**
- `id` - Unique target identifier
- `user_id` - Foreign key to users table
- `name` - Target name
- `url` - Webhook destination URL
- `active` - Boolean active status
- `headers` - JSONB custom headers
- `timeout` - Request timeout in milliseconds
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### How It Works

1. **Webhook Verification**: Facebook sends a GET request to verify your webhook URL. The server responds with the challenge token if the verify token matches.

2. **Webhook Reception**: Facebook sends POST requests with event data. The server:
   - Verifies the request signature (if FB_APP_SECRET is configured)
   - Responds immediately with 200 OK
   - Processes the webhook asynchronously

3. **Webhook Forwarding**: For each webhook event:
   - Retrieves all active targets from storage
   - Forwards the event payload to each target URL
   - Logs the forwarding results

4. **Target Management**: Targets are stored in `data/targets.json` and managed via REST API.

## Webhook Payload

When forwarding to your target applications, the payload includes:

```json
{
  "object": "page",
  "entry": { ... },
  "event": { ... },
  "timestamp": "2025-10-27T12:00:00.000Z"
}
```

The payload also includes custom headers:
- `X-Forwarded-By: TRFBWebhook`
- `X-Original-Source: Facebook`

## Security

### Request Signature Verification

If `FB_APP_SECRET` is set, the server verifies that webhook requests come from Facebook by validating the `x-hub-signature-256` header.

### HTTPS Required

Facebook requires HTTPS for webhook URLs in production. Use a reverse proxy (nginx) or hosting platform with SSL.

### API Security

Consider adding authentication to the target management API in production:
- Add API key validation
- Implement user authentication
- Use environment variables for secrets

## Production Deployment

### Recommended Setup

1. Use a process manager (PM2, systemd)
2. Set up HTTPS with nginx reverse proxy
3. Use environment variables for secrets
4. Consider using a database instead of JSON file storage
5. Implement logging and monitoring

### Example PM2 Configuration

```bash
pm2 start src/index.js --name trfb-webhook
pm2 save
pm2 startup
```

### Example nginx Configuration

```nginx
server {
    listen 80;
    server_name webhook.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Testing

### Test Webhook Verification

```bash
curl "http://localhost:3001/webhook?hub.mode=subscribe&hub.verify_token=your_verify_token&hub.challenge=test123"
```

Should return: `test123`

### Test Target Management

```bash
# Create a target
curl -X POST http://localhost:3001/api/targets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Target",
    "url": "https://webhook.site/unique-url",
    "active": true
  }'

# List targets
curl http://localhost:3001/api/targets

# Test a target
curl -X POST http://localhost:3001/api/targets/TARGET_ID/test
```

## Troubleshooting

### Webhook verification fails
- Check that `FB_VERIFY_TOKEN` in `.env` matches what you entered in Facebook
- Verify the server is accessible from the internet
- Check server logs for details

### Webhooks not being received
- Verify your Facebook Page is subscribed to the webhook
- Check that the webhook fields are subscribed
- Ensure your server is running and accessible via HTTPS
- Check Facebook App settings and permissions

### Forwarding fails
- Test your target URL is accessible
- Check target URL returns a successful status
- Verify any custom headers are correct
- Check timeout settings

## Database Management

### Manual Schema Initialization

If needed, you can manually initialize the database schema:

```bash
node src/db/init.js
```

This creates:
- `users` table with indexes
- `webhook_targets` table with indexes and foreign keys

### Database Migrations

For schema changes in the future, create migration scripts in `src/db/migrations/`.

## Future Enhancements

- [x] PostgreSQL database storage
- [x] Authentication and user management (JWT)
- [x] Multi-user support with data isolation
- [ ] Webhook event filtering and transformation
- [ ] Retry logic for failed forwards
- [ ] Webhook history and analytics
- [ ] Rate limiting
- [ ] Database connection pooling optimization

## License

ISC
