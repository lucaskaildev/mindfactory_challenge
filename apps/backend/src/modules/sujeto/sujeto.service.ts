import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sujeto } from '@/entities/sujeto.entity';
import { CreateSujetoDto } from '@/modules/sujeto/dto';
import { isDuplicateKeyError } from '@/database';

@Injectable()
export class SujetoService {
  constructor(
    @InjectRepository(Sujeto)
    private readonly sujetoRepository: Repository<Sujeto>,
  ) { }

  async create(createSujetoDto: CreateSujetoDto): Promise<Sujeto> {
    try {
      const created = await this.sujetoRepository.save({
        cuit: createSujetoDto.cuit,
        denominacion: createSujetoDto.denominacion,
      });
      return created;
    } catch (err) {
      if (isDuplicateKeyError(err))
        throw new ConflictException('El CUIT ya está registrado.'); //TODO: create a db error mapper to check if it was unique constraint, this leaks information
      throw err;
    }
  }

  async findByCuit(cuit: string): Promise<Sujeto | null> {
    const sujeto = await this.sujetoRepository.findOne({
      where: { cuit },
    });
    if (!sujeto) {
      return null;
    }
    return sujeto;
  }
}
