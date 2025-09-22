import { Module } from '@nestjs/common';
import { getPostgreSqlDatabaseProvider } from '@/database/providers/postgresql-datasource.provider';

@Module({
  imports: [],
  providers: [getPostgreSqlDatabaseProvider()],
  exports: [getPostgreSqlDatabaseProvider()],
})
export class DatabaseModule { }
