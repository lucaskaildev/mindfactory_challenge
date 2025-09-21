import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomotorConDuenoView } from '@/entities/automotor-con-duenio.view.entity';
import { Automotor } from '@/entities/automotor.entity';
import { ObjetoDeValor } from '@/entities/objeto-de-valor.entity';
import { VinculoSujetoObjeto } from '@/entities/vinculo-sujeto-objeto.entity';
import { AutomotorService } from './automotor.service';
import { AutomotorController } from './automotor.controller';
import { SujetoModule } from '@/modules/sujeto/sujeto.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AutomotorConDuenoView,
      Automotor,
      ObjetoDeValor,
      VinculoSujetoObjeto,
    ]),
    SujetoModule,
  ],
  providers: [AutomotorService],
  controllers: [AutomotorController],
  exports: [AutomotorService],
})
export class AutomotorModule {}
