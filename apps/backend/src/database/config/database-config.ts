import { DataSourceOptions } from 'typeorm';

import { config } from 'dotenv';
if (process.env.NODE_ENV !== 'production') config(); // loads .env variables into process.env

export class DatabaseConfig {
  public getConfig = (): DataSourceOptions => {
    return {
      //TODO: get from env
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: this.getPort(),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: ['dist/entities/*.js'],
      migrations: ['dist/migrations/*.js'],
      synchronize: false,
    };
  };

  private getPort(): number {
    const envPort: string | undefined = process.env.POSTGRES_PORT;
    return envPort ? parseInt(envPort) : 5433;
  }
}

export default new DatabaseConfig();
