import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sujeto } from '@/entities/sujeto.entity';
import { SujetoService } from '@/sujeto/sujeto.service';
import { SujetoController } from '@/sujeto/sujeto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sujeto])],
  providers: [SujetoService],
  controllers: [SujetoController],
  exports: [SujetoService],
})
export class SujetoModule { }

