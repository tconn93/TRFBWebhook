/**
 * Migration: Add Facebook OAuth fields to users table
 */

require('dotenv').config();
const { query } = require('../connection');

async function up() {
  console.log('Adding Facebook OAuth fields to users table...');

  await query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS facebook_user_id VARCHAR(255),
    ADD COLUMN IF NOT EXISTS facebook_access_token TEXT,
    ADD COLUMN IF NOT EXISTS facebook_token_expires TIMESTAMP,
    ADD COLUMN IF NOT EXISTS facebook_connected_at TIMESTAMP;
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_users_facebook_id ON users(facebook_user_id);
  `);

  console.log('✓ Facebook OAuth fields added');
}

async function down() {
  console.log('Removing Facebook OAuth fields from users table...');

  await query(`
    DROP INDEX IF EXISTS idx_users_facebook_id;
  `);

  await query(`
    ALTER TABLE users
    DROP COLUMN IF EXISTS facebook_user_id,
    DROP COLUMN IF EXISTS facebook_access_token,
    DROP COLUMN IF EXISTS facebook_token_expires,
    DROP COLUMN IF EXISTS facebook_connected_at;
  `);

  console.log('✓ Facebook OAuth fields removed');
}

// Run if executed directly
if (require.main === module) {
  up()
    .then(() => {
      console.log('Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { up, down };
