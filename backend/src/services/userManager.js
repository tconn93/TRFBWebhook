/**
 * User Manager - Manages user accounts and authentication
 * PostgreSQL version
 */

const bcrypt = require('bcryptjs');
const { query } = require('../db/connection');

/**
 * Get user by email
 */
async function getUserByEmail(email) {
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email.toLowerCase()]
  );
  return result.rows[0];
}

/**
 * Get user by ID
 */
async function getUserById(id) {
  const result = await query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

/**
 * Create a new user
 */
async function createUser(userData) {
  // Check if user already exists
  const existingUser = await getUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Generate ID
  const id = generateId();

  // Insert user
  const result = await query(
    `INSERT INTO users (id, email, name, password, created_at, updated_at)
     VALUES ($1, $2, $3, $4, NOW(), NOW())
     RETURNING id, email, name, created_at, updated_at`,
    [id, userData.email.toLowerCase(), userData.name, hashedPassword]
  );

  return result.rows[0];
}

/**
 * Verify user password
 */
async function verifyPassword(email, password) {
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return null;
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Update user data
 */
async function updateUser(id, updates) {
  // If updating password, hash it
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  // Build update query dynamically
  const fields = [];
  const values = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(updates)) {
    if (key !== 'id' && key !== 'created_at') {
      fields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  if (fields.length === 0) {
    return await getUserById(id);
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const result = await query(
    `UPDATE users SET ${fields.join(', ')}
     WHERE id = $${paramIndex}
     RETURNING id, email, name, created_at, updated_at`,
    values
  );

  return result.rows[0];
}

/**
 * Delete a user
 */
async function deleteUser(id) {
  const result = await query(
    'DELETE FROM users WHERE id = $1',
    [id]
  );

  return result.rowCount > 0;
}

/**
 * Generate a unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Connect Facebook account to user
 */
async function connectFacebookAccount(userId, facebookData) {
  const result = await query(
    `UPDATE users
     SET facebook_user_id = $1,
         facebook_access_token = $2,
         facebook_token_expires = $3,
         facebook_connected_at = NOW(),
         updated_at = NOW()
     WHERE id = $4
     RETURNING id, email, name, facebook_user_id, facebook_connected_at, created_at, updated_at`,
    [
      facebookData.facebookUserId,
      facebookData.accessToken,
      facebookData.tokenExpires,
      userId
    ]
  );

  return result.rows[0];
}

/**
 * Disconnect Facebook account from user
 */
async function disconnectFacebookAccount(userId) {
  const result = await query(
    `UPDATE users
     SET facebook_user_id = NULL,
         facebook_access_token = NULL,
         facebook_token_expires = NULL,
         facebook_connected_at = NULL,
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, email, name, created_at, updated_at`,
    [userId]
  );

  return result.rows[0];
}

/**
 * Check if user has Facebook connected
 */
async function hasFacebookConnected(userId) {
  const result = await query(
    'SELECT facebook_user_id, facebook_connected_at FROM users WHERE id = $1',
    [userId]
  );

  const user = result.rows[0];
  return {
    connected: !!user.facebook_user_id,
    connectedAt: user.facebook_connected_at
  };
}

/**
 * Get user by Facebook ID
 */
async function getUserByFacebookId(facebookUserId) {
  const result = await query(
    'SELECT * FROM users WHERE facebook_user_id = $1',
    [facebookUserId]
  );
  return result.rows[0];
}

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  verifyPassword,
  updateUser,
  deleteUser,
  connectFacebookAccount,
  disconnectFacebookAccount,
  hasFacebookConnected,
  getUserByFacebookId
};
