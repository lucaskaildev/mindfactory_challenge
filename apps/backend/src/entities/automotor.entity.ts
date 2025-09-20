import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  ValueTransformer,
} from 'typeorm';
import { ObjetoDeValor } from './objeto-de-valor.entity';

const YYYYMMTransformer: ValueTransformer = {
  to: (value: Date): number => {
    const year = value.getFullYear();
    const month = value.getMonth() + 1;
    return year * 100 + month;
  },
  from: (value: number): Date => {
    const year = Math.floor(value / 100); // we obtain something like 2025.09 and round it down
    const month = value % 100; // we obtain the last two digits, something like 9 if value is 202509
    return new Date(year, month - 1, 1);
  },
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
