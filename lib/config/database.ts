/**
 * Database Configuration for Next.js API Routes
 * 
 * This module provides a PostgreSQL connection pool with lazy initialization.
 * The database tables are created automatically on first connection.
 * 
 * Migration Note: Moved from backend/src/config/database.ts
 * Changes: Uses singleton pattern for connection pooling in serverless environment
 */

import { Pool } from 'pg';

// Singleton pool instance
let pool: Pool | null = null;
let isInitialized = false;

/**
 * Get the database pool with lazy initialization
 * Creates connection pool on first call and initializes tables
 */
export async function getDbPool(): Promise<Pool> {
  // Create pool if it doesn't exist
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false, // Required for Railway/Heroku SSL
      },
      // Connection pool settings for serverless
      max: 10, // Maximum connections
      idleTimeoutMillis: 30000, // Close idle connections after 30s
      connectionTimeoutMillis: 10000, // Timeout after 10s if can't connect
    });

    // Handle pool errors
    pool.on('error', (err: Error) => {
      console.error('Unexpected database pool error:', err);
    });
  }

  // Initialize tables on first access
  if (!isInitialized) {
    await initializeDatabase();
    isInitialized = true;
  }

  return pool;
}

/**
 * Initialize database tables if they don't exist
 */
async function initializeDatabase(): Promise<void> {
  if (!pool) {
    throw new Error('Pool not initialized');
  }

  const client = await pool.connect();

  try {
    // Create tables for conversations and messages
    await client.query(`
      -- Conversations table: Stores chat sessions
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR(255) NOT NULL,
        repository_id VARCHAR(255),
        repository_name VARCHAR(255),
        repository_owner VARCHAR(255),
        title TEXT NOT NULL DEFAULT 'New Conversation',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Messages table: Stores individual chat messages
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
        role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Indexes for faster queries
      CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
      CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Execute a query on the database
 * Automatically handles pool retrieval
 */
export async function query<T>(
  text: string,
  params?: unknown[]
): Promise<{ rows: T[]; rowCount: number }> {
  const pool = await getDbPool();
  const result = await pool.query(text, params);
  return {
    rows: result.rows as T[],
    rowCount: result.rowCount ?? 0,
  };
}

/**
 * Get a client for transactions
 */
export async function getClient() {
  const pool = await getDbPool();
  return pool.connect();
}

export default getDbPool;
