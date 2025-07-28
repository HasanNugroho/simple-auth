import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const connectionOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    path.join(
      __dirname,
      isProduction ? '../dist/entities/*.entity.js' : '../entities/*.entity.ts'
    ),
  ],
  migrations: [
    path.join(
      __dirname,
      isProduction ? '../dist/migrations/*.js' : '../../migrations/*.ts'
    ),
  ],
  synchronize: false,
  logging: !isProduction,
};

export const connectionSource = new DataSource(connectionOptions);
