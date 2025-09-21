import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ObjetoDeValor } from '@/entities/objeto-de-valor.entity';
import { Sujeto } from '@/entities/sujeto.entity';

@Entity('Vinculo_Sujeto_Objeto')
// TODO: create partial unique index for active owner constraint in migration:
export class VinculoSujetoObjeto {
  @PrimaryGeneratedColumn('increment', { name: 'vso_id' })
  id: number;

  @Column({ name: 'vso_ovp_id' })
  @Index('idx_vso_ovp')
  ovpId: number;

  @Column({ name: 'vso_spo_id' })
  @Index('idx_vso_spo')
  spoId: number;

  @Column({ name: 'vso_tipo_vinculo', default: 'DUENO', length: 30 })
  tipoVinculo: string;

  @Column({
    name: 'vso_porcentaje',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 100,
  })
  porcentaje: number;

  @Column({ name: 'vso_responsable', length: 1, default: 'S' })
  responsable: string;

  @Column({ name: 'vso_fecha_inicio', default: () => 'CURRENT_DATE' })
  fechaInicio: Date;

  @Column({ name: 'vso_fecha_fin', nullable: true })
  fechaFin?: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  createdAt: Date;

  @ManyToOne(() => ObjetoDeValor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vso_ovp_id' })
  objetoValor: ObjetoDeValor;

  @ManyToOne(() => Sujeto, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'vso_spo_id' })
  sujeto: Sujeto;
}
