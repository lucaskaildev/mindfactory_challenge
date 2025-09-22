import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { VinculoSujetoObjeto } from '@/entities/vinculo-sujeto-objeto.entity';

@Entity('Objeto_De_Valor')
export class ObjetoDeValor {
  @PrimaryGeneratedColumn('increment', { name: 'ovp_id' })
  id: number;

  @Column({ name: 'ovp_tipo', default: 'AUTOMOTOR', length: 30 })
  tipo: string;

  @Column({ name: 'ovp_codigo', unique: true, length: 64 })
  codigo: string;

  @Column({ name: 'ovp_descripcion', length: 240, nullable: true })
  descripcion: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => VinculoSujetoObjeto, (vinculo) => vinculo.objetoValor) // objeto can have multiple vinculo-sujeto-objeto
  vinculos: VinculoSujetoObjeto[];
}
