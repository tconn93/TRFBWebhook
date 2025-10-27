/**
 * API Client for TRFBWebhook Backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Get auth token from localStorage
 */
function getToken() {
  return localStorage.getItem('authToken');
}

/**
 * Set auth token in localStorage
 */
function setToken(token) {
  localStorage.setItem('authToken', token);
}

/**
 * Remove auth token from localStorage
 */
function removeToken() {
  localStorage.removeItem('authToken');
}

/**
 * Make an authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// ===== Authentication API =====

/**
 * Register a new user
 */
export async function register(email, password, name) {
  const data = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name })
  });

  if (data.token) {
    setToken(data.token);
  }

  return data;
}

/**
 * Login user
 */
export async function login(email, password) {
  const data = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  if (data.token) {
    setToken(data.token);
  }

  return data;
}

/**
 * Logout user
 */
export async function logout() {
  await apiRequest('/api/auth/logout', {
    method: 'POST'
  });

  removeToken();
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  return await apiRequest('/api/auth/me');
}

// ===== Webhook Targets API =====

/**
 * Get all webhook targets for the current user
 */
export async function getTargets() {
  return await apiRequest('/api/targets');
}

/**
 * Get a specific webhook target by ID
 */
export async function getTarget(id) {
  return await apiRequest(`/api/targets/${id}`);
}

/**
 * Create a new webhook target
 */
export async function createTarget(targetData) {
  return await apiRequest('/api/targets', {
    method: 'POST',
    body: JSON.stringify(targetData)
  });
}

/**
 * Update an existing webhook target
 */
export async function updateTarget(id, updates) {
  return await apiRequest(`/api/targets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

/**
 * Delete a webhook target
 */
export async function deleteTarget(id) {
  return await apiRequest(`/api/targets/${id}`, {
    method: 'DELETE'
  });
}

/**
 * Test a webhook target
 */
export async function testTarget(id) {
  return await apiRequest(`/api/targets/${id}/test`, {
    method: 'POST'
  });
}

// ===== Facebook OAuth API =====

/**
 * Get Facebook connection status
 */
export async function getFacebookStatus() {
  return await apiRequest('/api/facebook/status');
}

/**
 * Get Facebook OAuth authorization URL
 */
export async function getFacebookAuthUrl() {
  return await apiRequest('/api/facebook/auth-url');
}

/**
 * Disconnect Facebook account
 */
export async function disconnectFacebook() {
  return await apiRequest('/api/facebook/disconnect', {
    method: 'POST'
  });
}

// ===== Auth Helpers =====

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!getToken();
}

/**
 * Get stored token
 */
export { getToken, setToken, removeToken };
