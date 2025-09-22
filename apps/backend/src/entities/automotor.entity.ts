import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ObjetoDeValor } from '@/entities/objeto-de-valor.entity';

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
    type: 'int',
  })
  fechaFabricacion: number;

  @CreateDateColumn({ name: 'atr_fecha_alta_registro' })
  fechaAltaRegistro: Date;

  @OneToOne(() => ObjetoDeValor, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'atr_ovp_id' })
  objetoValor: ObjetoDeValor;
}
