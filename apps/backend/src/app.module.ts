import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './database/config/database-config';
import { SujetoModule } from '@/sujeto/sujeto.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig.getConfig()),
    DatabaseModule,
    SujetoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
