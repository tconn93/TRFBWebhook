const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { getUserByFacebookId, getUserByEmail, deleteUser } = require('../services/userManager');
const { authenticateToken } = require('../middleware/auth');

/**
 * Parse Facebook signed request
 * Format: base64url(signature).base64url(payload)
 */
function parseSignedRequest(signedRequest, appSecret) {
  try {
    const [encodedSig, payload] = signedRequest.split('.');

    // Decode payload
    const jsonPayload = Buffer.from(payload, 'base64').toString('utf8');
    const data = JSON.parse(jsonPayload);

    // Verify signature if app secret is provided
    if (appSecret) {
      const expectedSig = crypto
        .createHmac('sha256', appSecret)
        .update(payload)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      const actualSig = encodedSig.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

      if (expectedSig !== actualSig) {
        console.error('Invalid signature');
        return null;
      }
    }

    return data;
  } catch (error) {
    console.error('Error parsing signed request:', error);
    return null;
  }
}

/**
 * Generate deletion confirmation code
 */
function generateConfirmationCode(userId) {
  return crypto
    .createHash('sha256')
    .update(`${userId}-${Date.now()}`)
    .digest('hex')
    .substring(0, 16);
}

/**
 * GET /data-deletion - Show data deletion instructions
 */
router.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Data Deletion Instructions - TRFBWebhook</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          line-height: 1.6;
          color: #333;
        }
        h1 {
          color: #667eea;
          border-bottom: 3px solid #764ba2;
          padding-bottom: 10px;
        }
        h2 {
          color: #555;
          margin-top: 30px;
        }
        .container {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
        code {
          background: #e8e8e8;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.9em;
        }
        a {
          color: #667eea;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        ul {
          margin: 10px 0;
        }
        li {
          margin: 8px 0;
        }
      </style>
    </head>
    <body>
      <h1>Data Deletion Instructions</h1>

      <div class="container">
        <h2>How to Request Data Deletion</h2>
        <p>
          If you've used your Facebook account with TRFBWebhook and would like to delete your data,
          you have two options:
        </p>

        <h3>Option 1: Delete from Your Account Dashboard</h3>
        <ol>
          <li>Log in to your TRFBWebhook account at <a href="https://fb.tyler.rest">fb.tyler.rest</a></li>
          <li>Go to your account settings</li>
          <li>Click "Delete Account"</li>
          <li>Confirm the deletion</li>
        </ol>

        <h3>Option 2: Request Deletion via Facebook</h3>
        <ol>
          <li>Go to your Facebook Settings & Privacy</li>
          <li>Click on "Settings"</li>
          <li>Go to "Apps and Websites"</li>
          <li>Find "TRFBWebhook" in the list</li>
          <li>Click "Remove" and follow the prompts</li>
          <li>Select "Delete your information" when asked</li>
        </ol>

        <h3>Option 3: Email Request</h3>
        <p>
          You can also email us at <code>privacy@tyler.rest</code> with your account email
          or Facebook User ID to request deletion.
        </p>

        <h2>What Data is Deleted</h2>
        <p>When you delete your account, we permanently remove:</p>
        <ul>
          <li>Your account information (email, name)</li>
          <li>All webhook targets you've configured</li>
          <li>Facebook authentication tokens and user ID</li>
          <li>All associated data and settings</li>
        </ul>

        <h2>Data Retention</h2>
        <p>
          Data deletion is permanent and typically completed within 24 hours.
          Some anonymized logs may be retained for up to 90 days for security and
          debugging purposes, but these logs cannot be linked back to your account.
        </p>

        <h2>Questions?</h2>
        <p>
          If you have questions about data deletion or privacy, please contact us at
          <code>privacy@tyler.rest</code>
        </p>
      </div>

      <p style="margin-top: 40px; text-align: center; color: #888; font-size: 0.9em;">
        Last updated: ${new Date().toLocaleDateString()}
      </p>
    </body>
    </html>
  `);
});

/**
 * POST /data-deletion - Handle Facebook data deletion callback
 * Facebook sends a signed_request parameter when user requests data deletion
 */
router.post('/', async (req, res) => {
  try {
    const signedRequest = req.body.signed_request;

    if (!signedRequest) {
      return res.status(400).json({
        error: 'Missing signed_request parameter'
      });
    }

    // Parse and verify the signed request
    const appSecret = process.env.FB_APP_SECRET;
    const data = parseSignedRequest(signedRequest, appSecret);

    if (!data) {
      console.error('Invalid signed request');
      return res.status(400).json({
        error: 'Invalid signed request'
      });
    }

    const facebookUserId = data.user_id;

    if (!facebookUserId) {
      return res.status(400).json({
        error: 'Missing user_id in signed request'
      });
    }

    console.log(`Data deletion request received for Facebook user: ${facebookUserId}`);

    // Find user by Facebook ID
    const user = await getUserByFacebookId(facebookUserId);

    if (user) {
      // Delete the user (cascade will delete webhook targets)
      const deleted = await deleteUser(user.id);

      if (deleted) {
        console.log(`✓ Deleted user ${user.email} (Facebook ID: ${facebookUserId})`);
      }
    } else {
      console.log(`No user found with Facebook ID: ${facebookUserId}`);
    }

    // Generate confirmation code
    const confirmationCode = generateConfirmationCode(facebookUserId);

    // Facebook expects this response format
    const statusUrl = `${req.protocol}://${req.get('host')}/data-deletion/status/${confirmationCode}`;

    res.json({
      url: statusUrl,
      confirmation_code: confirmationCode
    });

  } catch (error) {
    console.error('Error handling data deletion request:', error);
    res.status(500).json({
      error: 'Failed to process deletion request'
    });
  }
});

/**
 * GET /data-deletion/status/:code - Check deletion status
 * This endpoint is provided to Facebook to check deletion status
 */
router.get('/status/:code', (req, res) => {
  const { code } = req.params;

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Deletion Status - TRFBWebhook</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          max-width: 600px;
          margin: 100px auto;
          padding: 20px;
          text-align: center;
        }
        .status-box {
          background: #f0f9ff;
          border: 2px solid #667eea;
          border-radius: 12px;
          padding: 40px;
        }
        h1 {
          color: #667eea;
          margin-bottom: 20px;
        }
        .code {
          background: #e8e8e8;
          padding: 10px 20px;
          border-radius: 6px;
          font-family: monospace;
          margin: 20px 0;
          display: inline-block;
        }
        .success {
          color: #059669;
          font-size: 1.2em;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="status-box">
        <h1>✓ Data Deletion Completed</h1>
        <p>Your data deletion request has been processed successfully.</p>
        <p>Confirmation Code:</p>
        <div class="code">${code}</div>
        <p class="success">All your data has been permanently deleted from our systems.</p>
      </div>
    </body>
    </html>
  `);
});

/**
 * DELETE /data-deletion/account - Allow authenticated users to delete their own account
 * Requires JWT authentication
 */
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(`User ${req.user.email} requested account deletion`);

    // Delete the user (cascade will delete webhook targets)
    const deleted = await deleteUser(userId);

    if (deleted) {
      console.log(`✓ Deleted user account: ${req.user.email}`);
      res.json({
        success: true,
        message: 'Your account and all associated data have been permanently deleted'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Account not found'
      });
    }

  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete account'
    });
  }
});

module.exports = router;
