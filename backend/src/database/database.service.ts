import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool | null = null;

  constructor() {
    // Only create pool if DATABASE_URL is provided
    const databaseUrl = process.env.DATABASE_URL?.trim();
    if (databaseUrl) {
      this.pool = new Pool({
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });
    } else {
      console.warn('⚠️  DATABASE_URL is not set or is empty. Database features will be disabled.');
    }
  }

  async onModuleInit() {
    // Test connection only if DATABASE_URL is provided
    const databaseUrl = process.env.DATABASE_URL?.trim();
    if (!databaseUrl) {
      console.warn('⚠️  DATABASE_URL not set. Database features will be disabled.');
      console.warn('   Make sure your .env file is in the backend directory and contains: DATABASE_URL=postgresql://...');
      return;
    }
    
    if (!this.pool) {
      return;
    }
    
    try {
      await this.pool.query('SELECT NOW()');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      // Don't throw - allow server to start without database
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
    }
  }

  async query(text: string, params?: any[]) {
    if (!this.pool) {
      throw new Error('Database is not configured. Please set DATABASE_URL environment variable.');
    }
    return this.pool.query(text, params);
  }

  async getClient(): Promise<PoolClient> {
    if (!this.pool) {
      throw new Error('Database is not configured. Please set DATABASE_URL environment variable.');
    }
    return this.pool.connect();
  }

  get poolInstance() {
    return this.pool;
  }
}

