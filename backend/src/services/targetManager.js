/**
 * Target Manager - Manages webhook forwarding targets
 * PostgreSQL version
 */

const { query } = require('../db/connection');

/**
 * Get all targets (optionally filtered by userId)
 */
async function getAllTargets(userId = null) {
  if (userId) {
    const result = await query(
      'SELECT * FROM webhook_targets WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  const result = await query(
    'SELECT * FROM webhook_targets ORDER BY created_at DESC'
  );
  return result.rows;
}

/**
 * Get only active targets (optionally filtered by userId)
 */
async function getActiveTargets(userId = null) {
  if (userId) {
    const result = await query(
      'SELECT * FROM webhook_targets WHERE user_id = $1 AND active = true ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  const result = await query(
    'SELECT * FROM webhook_targets WHERE active = true ORDER BY created_at DESC'
  );
  return result.rows;
}

/**
 * Get target by ID (optionally verify ownership)
 */
async function getTargetById(id, userId = null) {
  let queryText = 'SELECT * FROM webhook_targets WHERE id = $1';
  let params = [id];

  if (userId) {
    queryText += ' AND user_id = $2';
    params.push(userId);
  }

  const result = await query(queryText, params);
  return result.rows[0];
}

/**
 * Add a new target
 */
async function addTarget(targetData, userId) {
  const id = generateId();

  const result = await query(
    `INSERT INTO webhook_targets (id, user_id, name, url, active, headers, timeout, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
     RETURNING *`,
    [
      id,
      userId,
      targetData.name,
      targetData.url,
      targetData.active !== undefined ? targetData.active : true,
      JSON.stringify(targetData.headers || {}),
      targetData.timeout || 30000
    ]
  );

  return result.rows[0];
}

/**
 * Update an existing target (optionally verify ownership)
 */
async function updateTarget(id, updates, userId = null) {
  // First check if target exists and user owns it
  const existing = await getTargetById(id, userId);
  if (!existing) {
    return null;
  }

  // Build update query dynamically
  const fields = [];
  const values = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(updates)) {
    if (key !== 'id' && key !== 'user_id' && key !== 'created_at') {
      if (key === 'headers') {
        fields.push(`${key} = $${paramIndex}`);
        values.push(JSON.stringify(value));
      } else {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
      }
      paramIndex++;
    }
  }

  if (fields.length === 0) {
    return existing;
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  if (userId) {
    values.push(userId);
    const result = await query(
      `UPDATE webhook_targets SET ${fields.join(', ')}
       WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
       RETURNING *`,
      values
    );
    return result.rows[0];
  } else {
    const result = await query(
      `UPDATE webhook_targets SET ${fields.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );
    return result.rows[0];
  }
}

/**
 * Delete a target (optionally verify ownership)
 */
async function deleteTarget(id, userId = null) {
  let queryText = 'DELETE FROM webhook_targets WHERE id = $1';
  let params = [id];

  if (userId) {
    queryText += ' AND user_id = $2';
    params.push(userId);
  }

  const result = await query(queryText, params);
  return result.rowCount > 0;
}

/**
 * Generate a unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

module.exports = {
  getAllTargets,
  getActiveTargets,
  getTargetById,
  addTarget,
  updateTarget,
  deleteTarget
};
