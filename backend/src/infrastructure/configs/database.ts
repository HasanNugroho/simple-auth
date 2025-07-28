import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';
import { connectionSource } from './data-source';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export class Database {
  private dataSource: DataSource;
  private conAttempts = 0;
  private maxAttempts = 10;
  private retryDelay = 3000;

  constructor() {
    this.dataSource = connectionSource;
  }

  private async retryInitialization(): Promise<void> {
    if (this.conAttempts < this.maxAttempts) {
      this.conAttempts++;
      console.log(
        `Database connection failed. Retry attempt ${this.conAttempts}/${this.maxAttempts}...`
      );
      await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
      await this.initDatabase();
    } else {
      console.error('Max database connection attempts reached. Exiting...');
      process.exit(1);
    }
  }

  async initDatabase(): Promise<void> {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
        console.log('Database connected successfully!');
      }
    } catch (error) {
      console.error('Database connection error:', error);
      await this.retryInitialization();
    }
  }

  async closeDatabaseConnection(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
      console.log('Database connection closed.');
    }
  }
}
