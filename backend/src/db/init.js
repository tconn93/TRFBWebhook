/**
 * Database Schema Initialization
 * Run this to create the required tables
 */

const { query } = require('./connection');

async function initializeDatabase() {
  console.log('Initializing database schema...');

  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        facebook_user_id VARCHAR(255),
        facebook_access_token TEXT,
        facebook_token_expires TIMESTAMP,
        facebook_connected_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Users table created');

    // Add Facebook columns if they don't exist (migration)
    try {
      await query(`
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS facebook_user_id VARCHAR(255),
        ADD COLUMN IF NOT EXISTS facebook_access_token TEXT,
        ADD COLUMN IF NOT EXISTS facebook_token_expires TIMESTAMP,
        ADD COLUMN IF NOT EXISTS facebook_connected_at TIMESTAMP;
      `);
      console.log('✓ Facebook columns added to users table');
    } catch (error) {
      // Columns might already exist
      console.log('  Facebook columns already exist');
    }

    // Create webhook_targets table
    await query(`
      CREATE TABLE IF NOT EXISTS webhook_targets (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        active BOOLEAN DEFAULT true,
        headers JSONB DEFAULT '{}',
        timeout INTEGER DEFAULT 30000,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('✓ Webhook targets table created');

    // Create indexes
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);
    console.log('✓ Index on users.email created');

    await query(`
      CREATE INDEX IF NOT EXISTS idx_targets_user_id ON webhook_targets(user_id);
    `);
    console.log('✓ Index on webhook_targets.user_id created');

    await query(`
      CREATE INDEX IF NOT EXISTS idx_targets_active ON webhook_targets(active);
    `);
    console.log('✓ Index on webhook_targets.active created');

    console.log('✅ Database schema initialization completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database ready!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to initialize database:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };
