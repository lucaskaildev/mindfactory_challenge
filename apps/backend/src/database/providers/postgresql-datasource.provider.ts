import postgreSqlDataSource from '@/database/datasources/postgresql.datasource';
import { DataSourceFactory } from '..';

export function getPostgreSqlDatabaseProvider(): DataSourceFactory {
  return {
    provide: 'POSTGRESQL_DATASOURCE',
    useFactory: async () => {
      return await postgreSqlDataSource.initialize();
    },
  };
}
