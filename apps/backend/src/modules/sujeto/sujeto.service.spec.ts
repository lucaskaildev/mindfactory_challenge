import 'reflect-metadata';
import { ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SujetoService } from '@/modules/sujeto/sujeto.service';
import { Sujeto } from '@/entities/sujeto.entity';
import { CreateSujetoDto } from '@/modules/sujeto/dto';
import * as db from '@/database';

function createRepositoryMock() {
  return {
    save: jest.fn(),
    findOne: jest.fn(),
  } as unknown as jest.Mocked<Repository<Sujeto>>;
}

describe('SujetoService', () => {
  let service: SujetoService;
  let repo: jest.Mocked<Repository<Sujeto>>;

  beforeEach(() => {
    repo = createRepositoryMock();
    service = new SujetoService(repo as Repository<Sujeto>);
  });

  describe('create', () => {
    const dto: CreateSujetoDto = {
      cuit: '20123456789',
      denominacion: 'ACME S.A.',
    };

    it('saves and returns sujeto on success', async () => {
      const saved: Sujeto = {
        id: 1,
        cuit: dto.cuit,
        denominacion: dto.denominacion,
        createdAt: new Date(),
        updatedAt: new Date(),
        vinculos: [],
      };
      (repo.save as any).mockResolvedValue(saved);

      const result = await service.create(dto);

      expect(repo.save).toHaveBeenCalledWith({
        cuit: dto.cuit,
        denominacion: dto.denominacion,
      });
      expect(result).toBe(saved);
    });

    it('maps duplicate key to ConflictException', async () => {
      jest.spyOn(db, 'isDuplicateKeyError').mockReturnValue(true);
      (repo.save as any).mockRejectedValue({ code: db.DUPLICATE_KEY_CODE });

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('rethrows generic errors', async () => {
      jest.spyOn(db, 'isDuplicateKeyError').mockReturnValue(false);
      const generic = new Error('boom');
      (repo.save as any).mockRejectedValue(generic);

      await expect(service.create(dto)).rejects.toBe(generic);
    });
  });

  describe('findByCuit', () => {
    it('returns sujeto when found', async () => {
      const sujeto: Sujeto = {
        id: 2,
        cuit: '20999999999',
        denominacion: 'Found Co',
        createdAt: new Date(),
        updatedAt: new Date(),
        vinculos: [],
      };
      (repo.findOne as any).mockResolvedValue(sujeto);

      const result = await service.findByCuit('20999999999');
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { cuit: '20999999999' },
      });
      expect(result).toBe(sujeto);
    });

    it('returns null when not found', async () => {
      (repo.findOne as any).mockResolvedValue(null);

      const result = await service.findByCuit('20000000000');
      expect(result).toBeNull();
    });
  });
});
