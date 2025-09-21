import { DataSource } from 'typeorm';

export type DataSourceFactory = {
  provide: string;
  useFactory: () => Promise<DataSource>;
};

export const DUPLICATE_KEY_CODE = 23505;

export const isDuplicateKeyError = (err?) =>
  err?.code == DUPLICATE_KEY_CODE ||
  err?.driverError?.code == DUPLICATE_KEY_CODE;
