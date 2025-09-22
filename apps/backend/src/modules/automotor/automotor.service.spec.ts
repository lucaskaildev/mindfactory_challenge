import 'reflect-metadata';
import { UnprocessableEntityException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AutomotorService } from '@/modules/automotor/automotor.service';
import {
  AutomotorConDuenoView,
  Automotor,
  ObjetoDeValor,
  VinculoSujetoObjeto,
} from '@/entities';
import { SujetoService } from '@/modules/sujeto/sujeto.service';
import {
  CreateAutomotorDto,
  UpdateAutomotorDto,
} from '@/modules/automotor/dto';
import * as db from '@/database';

function createRepoMock<T extends object>(
  methods: Array<keyof Repository<any>> = [],
) {
  // easier mock generation
  const base: any = {};
  for (const m of methods) base[m] = jest.fn();
  return base as jest.Mocked<Repository<T>>;
}

function createQueryBuilderMock() {
  // same for query builders used in service
  const qb = {
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ affected: 1 }),
  };
  return qb;
}

describe('AutomotorService', () => {
  let automotorRepo: jest.Mocked<Repository<Automotor>>;
  let vsoRepo: jest.Mocked<Repository<VinculoSujetoObjeto>>;
  let ownedRepo: jest.Mocked<Repository<AutomotorConDuenoView>>;
  let sujetoService: jest.Mocked<SujetoService>;
  let dataSource = {
    transaction: jest.fn(),
  } as unknown as DataSource;
  let service: AutomotorService;

  beforeEach(() => {
    automotorRepo = createRepoMock<Automotor>([
      'findOne',
      'update',
      'upsert',
    ]) as any; // pass methods to repo mock factory
    vsoRepo = createRepoMock<VinculoSujetoObjeto>([
      'save',
      'createQueryBuilder',
    ]) as any;
    ownedRepo = createRepoMock<AutomotorConDuenoView>([
      'find',
      'findOne',
    ]) as any;

    sujetoService = {
      findByCuit: jest.fn(),
    } as unknown as jest.Mocked<SujetoService>;

    dataSource = { transaction: jest.fn() } as any;

    service = new AutomotorService(
      automotorRepo as any,
      vsoRepo as any,
      ownedRepo as any,
      sujetoService as any,
      dataSource as any,
    );
  });

  describe('findAll', () => {
    it('returns all from view repo', async () => {
      const view: AutomotorConDuenoView[] = [
        {
          dominio: 'AA123BB',
          numeroChasis: null as any,
          numeroMotor: null as any,
          color: null as any,
          fechaFabricacion: 202301,
          duenioCuit: '20123456789',
          duenioDenominacion: 'X',
        } as any,
      ];
      (ownedRepo.find as any).mockResolvedValue(view);
      const result = await service.findAll();
      expect(result).toBe(view);
      expect(ownedRepo.find).toHaveBeenCalled();
    });
  });

  describe('findByDominio', () => {
    it('returns view or null', async () => {
      const row = { dominio: 'AA123BB' } as AutomotorConDuenoView;
      (ownedRepo.findOne as any).mockResolvedValueOnce(row);
      await expect(service.findByDominio('AA123BB')).resolves.toBe(row);
      expect(ownedRepo.findOne).toHaveBeenCalledWith({
        where: { dominio: 'AA123BB' },
      });

      (ownedRepo.findOne as any).mockResolvedValueOnce(null);
      await expect(service.findByDominio('ZZZ000')).resolves.toBeNull();
      expect(ownedRepo.findOne).toHaveBeenLastCalledWith({
        where: { dominio: 'ZZZ000' },
      });
    });
  });

  describe('createOrUpdate', () => {
    const base: CreateAutomotorDto = {
      dominio: 'AA123BB',
      fechaFabricacion: 202401,
      cuitDuenio: '20123456789',
      color: 'Azul',
      numeroChasis: 'CHS',
      numeroMotor: 'MTR',
    };

    it('throws when dominio is missing', async () => {
      await expect(service.createOrUpdate({} as any)).rejects.toBeInstanceOf(
        UnprocessableEntityException,
      );
    });

    it('throws when cuitDuenio is provided but sujeto not found', async () => {
      sujetoService.findByCuit.mockResolvedValue(null);
      await expect(service.createOrUpdate(base)).rejects.toBeInstanceOf(
        UnprocessableEntityException,
      );
      expect(sujetoService.findByCuit).toHaveBeenCalledWith('20123456789');
    });

    it('creates or updates with owner inside a transaction (new OVP)', async () => {
      sujetoService.findByCuit.mockResolvedValue({ id: 77 } as any);

      const ovpRepoTx = createRepoMock<ObjetoDeValor>(['findOneBy', 'save']);
      (ovpRepoTx.findOneBy as any).mockResolvedValue(null);
      (ovpRepoTx.save as any).mockResolvedValue({
        id: 123,
        codigo: base.dominio,
      });

      const autoRepoTx = createRepoMock<Automotor>(['upsert']);
      const vsoRepoTx = createRepoMock<VinculoSujetoObjeto>([
        'save',
        'createQueryBuilder',
      ]);

      const qb = createQueryBuilderMock();
      (vsoRepoTx.createQueryBuilder as any).mockReturnValue(qb);
      (vsoRepoTx.save as any).mockResolvedValue({});

      (dataSource.transaction as any).mockImplementation(async (cb: any) => {
        const manager = {
          getRepository: (entity: any) => {
            if (entity === ObjetoDeValor) return ovpRepoTx as any;
            if (entity === Automotor) return autoRepoTx as any;
            if (entity === VinculoSujetoObjeto) return vsoRepoTx as any;
            throw new Error('Unknown entity');
          },
        };
        return cb(manager);
      });

      const expectedView = { dominio: base.dominio } as AutomotorConDuenoView;
      (ownedRepo.findOne as any).mockResolvedValue(expectedView);

      const result = await service.createOrUpdate(base);

      expect(dataSource.transaction).toHaveBeenCalled();
      expect(ovpRepoTx.findOneBy).toHaveBeenCalledWith({
        codigo: base.dominio,
      });
      expect(ovpRepoTx.save).toHaveBeenCalled();
      expect(autoRepoTx.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          dominio: base.dominio,
          color: base.color,
          fechaFabricacion: base.fechaFabricacion,
        }),
        ['dominio'],
      );
      expect(vsoRepoTx.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ovpId: 123,
          spoId: 77,
          tipoVinculo: 'DUENO',
          responsable: 'S',
        }),
      );
      expect(result).toBe(expectedView);
    });

    it('silently fails if duplicate owner save error and proceeds', async () => {
      sujetoService.findByCuit.mockResolvedValue({ id: 10 } as any);

      const ovpRepoTx = createRepoMock<ObjetoDeValor>(['findOneBy', 'save']);
      (ovpRepoTx.findOneBy as any).mockResolvedValue({
        id: 222,
        codigo: base.dominio,
      });

      const autoRepoTx = createRepoMock<Automotor>(['upsert']);
      const vsoRepoTx = createRepoMock<VinculoSujetoObjeto>([
        'save',
        'createQueryBuilder',
      ]);
      const qb = createQueryBuilderMock();
      (vsoRepoTx.createQueryBuilder as any).mockReturnValue(qb);

      jest.spyOn(db, 'isDuplicateKeyError').mockReturnValue(true);
      (vsoRepoTx.save as any).mockRejectedValue({
        code: db.DUPLICATE_KEY_CODE,
      });

      (dataSource.transaction as any).mockImplementation(async (cb: any) => {
        const manager = {
          getRepository: (entity: any) => {
            if (entity === ObjetoDeValor) return ovpRepoTx as any;
            if (entity === Automotor) return autoRepoTx as any;
            if (entity === VinculoSujetoObjeto) return vsoRepoTx as any;
            throw new Error('Unknown entity');
          },
        };
        return cb(manager);
      });

      const expectedView = { dominio: base.dominio } as AutomotorConDuenoView;
      (ownedRepo.findOne as any).mockResolvedValue(expectedView);

      const result = await service.createOrUpdate(base);
      expect(result).toBe(expectedView);
    });

    it('updates without owner when cuitDuenio not provided', async () => {
      const dto: UpdateAutomotorDto = {
        dominio: 'BB222CC',
        color: 'Rojo',
        fechaFabricacion: 202312,
      } as any;

      (ownedRepo.findOne as any).mockResolvedValue({
        dominio: dto.dominio,
      } as any);
      const result = await service.createOrUpdate(dto);
      expect(automotorRepo.update).toHaveBeenCalledWith(
        { dominio: dto.dominio },
        dto,
      );
      expect(result).toEqual({ dominio: dto.dominio });
    });
  });

  describe('changeOwnership', () => {
    it('returns false if automotor not found', async () => {
      (automotorRepo.findOne as any).mockResolvedValue(null);
      const changed = await service.changeOwnership(
        'AA123BB',
        1,
        vsoRepo as any,
      );
      expect(changed).toBe(false);
      expect(vsoRepo.createQueryBuilder).not.toHaveBeenCalled();
    });

    it('updates existing owner rows and returns boolean based on affected', async () => {
      (automotorRepo.findOne as any).mockResolvedValue({ ovpId: 999 });
      const qb = createQueryBuilderMock();
      (vsoRepo.createQueryBuilder as any).mockReturnValue(qb);

      const changed = await service.changeOwnership(
        'AA123BB',
        1,
        vsoRepo as any,
      );
      expect(qb.execute).toHaveBeenCalled();
      expect(changed).toBe(true);

      (qb.execute as any).mockResolvedValueOnce({ affected: 0 });
      const changed2 = await service.changeOwnership(
        'AA123BB',
        1,
        vsoRepo as any,
      );
      expect(changed2).toBe(false);
    });
  });

  describe('deleteByDominio', () => {
    it('returns false when automotor does not exist', async () => {
      (dataSource.transaction as any).mockImplementation(async (cb: any) => {
        const autoRepo = createRepoMock<Automotor>(['findOne']);
        (autoRepo.findOne as any).mockResolvedValue(null);
        const ovpRepo = createRepoMock<ObjetoDeValor>(['delete']);
        const manager = {
          getRepository: (entity: any) => {
            if (entity === Automotor) return autoRepo as any;
            if (entity === ObjetoDeValor) return ovpRepo as any;
            throw new Error('Unknown entity');
          },
        };
        return cb(manager);
      });

      const res = await service.deleteByDominio('AA123BB');
      expect(res).toBe(false);
    });

    it('deletes ovp and returns true when exists', async () => {
      (dataSource.transaction as any).mockImplementation(async (cb: any) => {
        const autoRepo = createRepoMock<Automotor>(['findOne']);
        (autoRepo.findOne as any).mockResolvedValue({ ovpId: 321 });
        const ovpRepo = createRepoMock<ObjetoDeValor>(['delete']);
        const manager = {
          getRepository: (entity: any) => {
            if (entity === Automotor) return autoRepo as any;
            if (entity === ObjetoDeValor) return ovpRepo as any;
            throw new Error('Unknown entity');
          },
        };
        return cb(manager);
      });

      const res = await service.deleteByDominio('AA123BB');
      expect(res).toBe(true);
    });
  });
});
