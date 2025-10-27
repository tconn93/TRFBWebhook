const express = require('express');
const router = express.Router();
const {
  getAllTargets,
  getTargetById,
  addTarget,
  updateTarget,
  deleteTarget
} = require('../services/targetManager');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication to all routes
router.use(authenticateToken);

/**
 * Get all webhook targets for the authenticated user
 * GET /api/targets
 */
router.get('/', (req, res) => {
  const targets = getAllTargets(req.user.id);
  res.json({
    success: true,
    count: targets.length,
    targets: targets
  });
});

/**
 * Get a specific target by ID (user must own it)
 * GET /api/targets/:id
 */
router.get('/:id', (req, res) => {
  const target = getTargetById(req.params.id, req.user.id);

  if (!target) {
    return res.status(404).json({
      success: false,
      error: 'Target not found'
    });
  }

  res.json({
    success: true,
    target: target
  });
});

/**
 * Create a new webhook target for the authenticated user
 * POST /api/targets
 * Body: { name, url, active, headers, timeout }
 */
router.post('/', (req, res) => {
  const { name, url, active, headers, timeout } = req.body;

  // Validation
  if (!name || !url) {
    return res.status(400).json({
      success: false,
      error: 'Name and URL are required'
    });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid URL format'
    });
  }

  const newTarget = addTarget({
    name,
    url,
    active,
    headers,
    timeout
  }, req.user.id);

  res.status(201).json({
    success: true,
    target: newTarget
  });
});

/**
 * Update an existing webhook target (user must own it)
 * PUT /api/targets/:id
 * Body: { name, url, active, headers, timeout }
 */
router.put('/:id', (req, res) => {
  const { name, url, active, headers, timeout } = req.body;

  // Validate URL if provided
  if (url) {
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format'
      });
    }
  }

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (url !== undefined) updates.url = url;
  if (active !== undefined) updates.active = active;
  if (headers !== undefined) updates.headers = headers;
  if (timeout !== undefined) updates.timeout = timeout;

  const updatedTarget = updateTarget(req.params.id, updates, req.user.id);

  if (!updatedTarget) {
    return res.status(404).json({
      success: false,
      error: 'Target not found'
    });
  }

  res.json({
    success: true,
    target: updatedTarget
  });
});

/**
 * Delete a webhook target (user must own it)
 * DELETE /api/targets/:id
 */
router.delete('/:id', (req, res) => {
  const deleted = deleteTarget(req.params.id, req.user.id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: 'Target not found'
    });
  }

  res.json({
    success: true,
    message: 'Target deleted successfully'
  });
});

/**
 * Test a webhook target (user must own it)
 * POST /api/targets/:id/test
 */
router.post('/:id/test', async (req, res) => {
  const target = getTargetById(req.params.id, req.user.id);

  if (!target) {
    return res.status(404).json({
      success: false,
      error: 'Target not found'
    });
  }

  const { forwardWebhook } = require('../services/forwarder');

  const testPayload = {
    test: true,
    message: 'This is a test webhook from TRFBWebhook',
    timestamp: new Date().toISOString(),
    object: 'test',
    entry: []
  };

  try {
    const result = await forwardWebhook(target, testPayload);
    res.json({
      success: result.success,
      status: result.status,
      message: result.success ? 'Test webhook sent successfully' : 'Test webhook failed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
