import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { Automotor } from '@/entities/automotor.entity';
import { ObjetoDeValor } from '@/entities/objeto-de-valor.entity';
import { VinculoSujetoObjeto } from '@/entities/vinculo-sujeto-objeto.entity';
import { SujetoService } from '@/modules/sujeto/sujeto.service';
import { CreateAutomotorDto, UpdateAutomotorDto } from '@/modules/automotor/dto';
import { AutomotorConDuenoView } from '@/entities';
import { isDuplicateKeyError } from '@/database';

@Injectable()
export class AutomotorService {
  constructor(
    @InjectRepository(Automotor)
    private readonly automotorRepository: Repository<Automotor>,
    @InjectRepository(VinculoSujetoObjeto)
    private readonly vsoRepository: Repository<VinculoSujetoObjeto>,
    @InjectRepository(AutomotorConDuenoView)
    private readonly ownedAutoRepository: Repository<AutomotorConDuenoView>,
    private readonly sujetoService: SujetoService,
    private readonly dataSource: DataSource,
  ) { }

  async findAll(): Promise<AutomotorConDuenoView[]> {
    return this.ownedAutoRepository.find();
  }

  async findByDominio(dominio: string): Promise<AutomotorConDuenoView | null> {
    const automotor = await this.ownedAutoRepository.findOne({
      where: { dominio },
    });
    return automotor;
  }

  async createOrUpdate(
    dto: CreateAutomotorDto | UpdateAutomotorDto,
  ): Promise<AutomotorConDuenoView> {
    if (!dto.dominio)
      throw new UnprocessableEntityException('Dominio es requerido');
    const dominio = dto.dominio;

    if (dto.cuitDuenio) {
      const sujeto = await this.sujetoService.findByCuit(dto.cuitDuenio);

      if (!sujeto) {
        throw new UnprocessableEntityException('No existe Sujeto con ese CUIT');
      }

      await this.dataSource.transaction(async (manager) => {
        const ovpRepo = manager.getRepository(ObjetoDeValor);
        const autoRepo = manager.getRepository(Automotor);
        const vsoRepo = manager.getRepository(VinculoSujetoObjeto);

        await this.changeOwnership(dominio, sujeto.id, vsoRepo);

        let ovp = await ovpRepo.findOneBy({ codigo: dominio });
        if (!ovp) {
          ovp = await ovpRepo.save({
            tipo: 'AUTOMOTOR',
            codigo: dominio,
            descripcion: `Automotor con dominio ${dominio}`,
          });
        }

        await autoRepo.upsert(
          {
            ovpId: ovp.id,
            dominio,
            numeroChasis: dto.numeroChasis,
            numeroMotor: dto.numeroMotor,
            color: dto.color,
            fechaFabricacion: dto.fechaFabricacion,
          },
          ['dominio'],
        );

        try {
          await vsoRepo.save({
            ovpId: ovp.id,
            spoId: sujeto.id,
            tipoVinculo: 'DUENO',
            porcentaje: 100,
            responsable: 'S',
          });
        } catch (err) {
          if (!isDuplicateKeyError(err)) {
            throw err;
          }
        }
      });
    } else {
      await this.automotorRepository.update({ dominio: dominio }, dto);
    }

    const automotor = await this.ownedAutoRepository.findOne({
      where: { dominio },
    });

    return automotor as AutomotorConDuenoView;
  }

  async changeOwnership(
    dominio: string,
    sujeto_id: number,
    vsoRepo?: Repository<VinculoSujetoObjeto>,
  ): Promise<boolean> {
    vsoRepo ||= this.vsoRepository;
    const ovp = await this.automotorRepository.findOne({
      where: { dominio },
      select: ['ovpId'],
    });

    if (!ovp) return false;
    const result = await vsoRepo // use query builder to leverage db timestamps
      .createQueryBuilder()
      .update()
      .set({ fechaFin: () => 'CURRENT_TIMESTAMP' })
      .where('vso_ovp_id = :ovpId', { ovpId: ovp.ovpId })
      .andWhere('vso_responsable = :resp', { resp: 'S' })
      .andWhere('vso_tipo_vinculo = :tipo', { tipo: 'DUENO' })
      .andWhere('vso_fecha_fin IS NULL')
      .execute();

    return Boolean(result.affected);
  }

  async deleteByDominio(dominio: string): Promise<boolean> {
    return this.dataSource.transaction(async (manager) => {
      const autoRepo = manager.getRepository(Automotor);
      const ovpRepo = manager.getRepository(ObjetoDeValor);

      const auto = await autoRepo.findOne({
        where: { dominio },
        select: ['ovpId'],
      });
      if (!auto) return false;

      await ovpRepo.delete({ id: auto.ovpId }); // deleting OVP handles deletion of automotor and VSO because of entity cascade config
      return true;
    });
  }
}
