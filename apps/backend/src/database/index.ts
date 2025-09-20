import { DataSource } from 'typeorm';

export type DataSourceFactory = {
  provide: string;
  useFactory: () => Promise<DataSource>;
};
