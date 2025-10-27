const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { forwardWebhook } = require('../services/forwarder');
const { getActiveTargets } = require('../services/targetManager');

/**
 * Facebook Webhook Verification (GET)
 * Facebook sends a GET request to verify the webhook endpoint
 * https://developers.facebook.com/docs/graph-api/webhooks/getting-started
 */
router.get('/', (req, res) => {
  // Facebook sends these query parameters
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'default_verify_token';

  console.log('Webhook verification request received');
  console.log('Mode:', mode);
  console.log('Token:', token);

  // Check if mode and token are correct
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified successfully!');
    // Respond with the challenge token from the request
    res.status(200).send(challenge);
  } else {
    console.log('Webhook verification failed!');
    res.status(403).send('Forbidden');
  }
});

/**
 * Facebook Webhook Event Handler (POST)
 * Facebook sends webhook events to this endpoint
 */
router.post('/', async (req, res) => {
  const body = req.body;

  console.log('Webhook event received');

  // Verify the request signature (optional but recommended)
  if (process.env.FB_APP_SECRET) {
    const signature = req.headers['x-hub-signature-256'];
    if (!verifyRequestSignature(req, signature)) {
      console.error('Invalid signature');
      return res.status(403).send('Forbidden');
    }
  }

  // Facebook expects a 200 OK response quickly
  // So we respond immediately and process asynchronously
  res.status(200).send('EVENT_RECEIVED');

  // Process the webhook asynchronously
  processWebhook(body);
});

/**
 * Verify that the request signature matches the expected signature
 */
function verifyRequestSignature(req, signature) {
  if (!signature) {
    return false;
  }

  const elements = signature.split('=');
  const signatureHash = elements[1];

  const expectedHash = crypto
    .createHmac('sha256', process.env.FB_APP_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  return signatureHash === expectedHash;
}

/**
 * Process webhook events and forward to target applications
 */
async function processWebhook(body) {
  console.log('Processing webhook:', JSON.stringify(body, null, 2));

  // Check if this is a page subscription
  if (body.object === 'page') {
    // Iterate over each entry (may be multiple if batched)
    body.entry.forEach(entry => {
      // Get the webhook event
      const webhookEvent = entry.messaging ? entry.messaging[0] : entry.changes[0];

      console.log('Webhook event:', JSON.stringify(webhookEvent, null, 2));

      // Get all active target webhooks
      const targets = getActiveTargets();

      // Forward to all targets
      targets.forEach(target => {
        forwardWebhook(target, {
          object: body.object,
          entry: entry,
          event: webhookEvent,
          timestamp: new Date().toISOString()
        });
      });
    });
  } else {
    console.log('Unknown webhook object type:', body.object);
  }
}

module.exports = router;
