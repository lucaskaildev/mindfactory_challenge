import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  ValueTransformer,
} from 'typeorm';
import { ObjetoDeValor } from '@/entities/objeto-de-valor.entity';
import { DateToYYYYMM, YYYYMMToDate } from '@/lib/date';

const YYYYMMTransformer: ValueTransformer = {
  to: DateToYYYYMM,
  from: YYYYMMToDate,
};

@Entity('Automotores')
export class Automotor {
  @PrimaryGeneratedColumn('increment', { name: 'atr_id' })
  id: number;

  @Column({ name: 'atr_ovp_id' })
  ovpId: number;

  @Column({ name: 'atr_dominio', unique: true, length: 8 })
  dominio: string;

  @Column({ name: 'atr_numero_chasis', length: 25, nullable: true })
  numeroChasis?: string;

  @Column({ name: 'atr_numero_motor', length: 25, nullable: true })
  numeroMotor?: string;

  @Column({ name: 'atr_color', length: 40, nullable: true })
  color?: string;

  @Column({
    name: 'atr_fecha_fabricacion',
    transformer: YYYYMMTransformer,
    type: 'int',
  })
  fechaFabricacion: Date;

  @CreateDateColumn({ name: 'atr_fecha_alta_registro' })
  fechaAltaRegistro: Date;

  @OneToOne(() => ObjetoDeValor, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'atr_ovp_id' })
  objetoValor: ObjetoDeValor;
}
