import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { VinculoSujetoObjeto } from '@/entities/vinculo-sujeto-objeto.entity';

@Entity('Sujeto')
export class Sujeto {
  @PrimaryGeneratedColumn('increment', { name: 'spo_id' })
  id: number;

  @Column({ name: 'spo_cuit', unique: true, length: 11 })
  cuit: string;

  @Column({ name: 'spo_denominacion', length: 160 })
  denominacion: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  updatedAt: Date;

  @OneToMany(() => VinculoSujetoObjeto, (vinculo) => vinculo.sujeto) // sujeto can have multiple vinculo-sujeto-objeto
  vinculos: VinculoSujetoObjeto[];
}
