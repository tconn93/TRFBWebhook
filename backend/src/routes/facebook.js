const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');
const {
  connectFacebookAccount,
  disconnectFacebookAccount,
  hasFacebookConnected
} = require('../services/userManager');

const FB_APP_ID = process.env.FB_APP_ID;
const FB_APP_SECRET = process.env.FB_APP_SECRET;
const FB_REDIRECT_URI = process.env.FB_REDIRECT_URI || 'http://localhost:3001/api/facebook/callback';

/**
 * Get Facebook OAuth connection status
 * GET /api/facebook/status
 */
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const status = await hasFacebookConnected(req.user.id);
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    console.error('Error checking Facebook status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check Facebook connection status'
    });
  }
});

/**
 * Get Facebook OAuth URL
 * GET /api/facebook/auth-url
 */
router.get('/auth-url', authenticateToken, (req, res) => {
  if (!FB_APP_ID) {
    return res.status(500).json({
      success: false,
      error: 'Facebook App ID not configured'
    });
  }

  const scopes = [
    'pages_show_list',
    'pages_messaging',
    'pages_manage_metadata'
  ].join(',');

  // Store user ID in state to retrieve after OAuth
  const state = Buffer.from(JSON.stringify({
    userId: req.user.id,
    timestamp: Date.now()
  })).toString('base64');

  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
    `client_id=${FB_APP_ID}` +
    `&redirect_uri=${encodeURIComponent(FB_REDIRECT_URI)}` +
    `&state=${state}` +
    `&scope=${encodeURIComponent(scopes)}`;

  res.json({
    success: true,
    authUrl
  });
});

/**
 * Facebook OAuth callback
 * GET /api/facebook/callback
 */
router.get('/callback', async (req, res) => {
  const { code, state, error, error_description } = req.query;

  // Handle OAuth errors
  if (error) {
    console.error('Facebook OAuth error:', error, error_description);
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?facebook_error=${error}`);
  }

  if (!code || !state) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?facebook_error=missing_parameters`);
  }

  try {
    // Decode state to get user ID
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    const userId = stateData.userId;

    // Exchange code for access token
    const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: FB_APP_ID,
        client_secret: FB_APP_SECRET,
        redirect_uri: FB_REDIRECT_URI,
        code
      }
    });

    const { access_token, expires_in } = tokenResponse.data;

    // Get Facebook user info
    const userResponse = await axios.get('https://graph.facebook.com/v18.0/me', {
      params: {
        access_token,
        fields: 'id,name,email'
      }
    });

    const facebookUserId = userResponse.data.id;

    // Calculate token expiration
    const tokenExpires = new Date(Date.now() + expires_in * 1000);

    // Save Facebook connection to user
    await connectFacebookAccount(userId, {
      facebookUserId,
      accessToken: access_token,
      tokenExpires
    });

    console.log(`Facebook connected for user ${userId}: ${facebookUserId}`);

    // Redirect to dashboard with success
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?facebook_connected=true`);
  } catch (error) {
    console.error('Facebook OAuth callback error:', error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?facebook_error=auth_failed`);
  }
});

/**
 * Disconnect Facebook account
 * POST /api/facebook/disconnect
 */
router.post('/disconnect', authenticateToken, async (req, res) => {
  try {
    await disconnectFacebookAccount(req.user.id);

    res.json({
      success: true,
      message: 'Facebook account disconnected successfully'
    });
  } catch (error) {
    console.error('Error disconnecting Facebook:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to disconnect Facebook account'
    });
  }
});

module.exports = router;
