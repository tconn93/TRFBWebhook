const axios = require('axios');

/**
 * Forward webhook payload to a target URL
 * @param {Object} target - Target configuration with url, headers, etc.
 * @param {Object} payload - Webhook payload to forward
 */
async function forwardWebhook(target, payload) {
  try {
    console.log(`Forwarding webhook to: ${target.url}`);

    const headers = {
      'Content-Type': 'application/json',
      'X-Forwarded-By': 'TRFBWebhook',
      'X-Original-Source': 'Facebook',
      ...target.headers
    };

    const response = await axios.post(target.url, payload, {
      headers: headers,
      timeout: target.timeout || 30000, // 30 second default timeout
      validateStatus: () => true // Accept any status code
    });

    console.log(`Forward to ${target.url} completed with status: ${response.status}`);

    // Log the result
    logForwardResult(target, payload, response);

    return {
      success: response.status >= 200 && response.status < 300,
      status: response.status,
      target: target.url
    };
  } catch (error) {
    console.error(`Error forwarding to ${target.url}:`, error.message);

    logForwardResult(target, payload, null, error);

    return {
      success: false,
      error: error.message,
      target: target.url
    };
  }
}

/**
 * Log forwarding results for debugging and monitoring
 */
function logForwardResult(target, payload, response, error) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    target: target.url,
    targetName: target.name,
    success: !error && response?.status >= 200 && response?.status < 300,
    status: response?.status,
    error: error?.message,
    payloadSize: JSON.stringify(payload).length
  };

  // In production, you might want to store this in a database
  // For now, just log to console
  if (logEntry.success) {
    console.log('Forward success:', logEntry);
  } else {
    console.error('Forward failed:', logEntry);
  }
}

/**
 * Forward to multiple targets in parallel
 * @param {Array} targets - Array of target configurations
 * @param {Object} payload - Webhook payload to forward
 */
async function forwardToMultipleTargets(targets, payload) {
  const promises = targets.map(target => forwardWebhook(target, payload));
  const results = await Promise.allSettled(promises);

  return results.map((result, index) => ({
    target: targets[index].url,
    ...result.value
  }));
}

module.exports = {
  forwardWebhook,
  forwardToMultipleTargets
};
