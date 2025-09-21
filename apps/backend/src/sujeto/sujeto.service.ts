import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sujeto } from '@/entities/sujeto.entity';
import { CreateSujetoDto, SujetoResponseDto } from '@/sujeto/dto';

@Injectable()
export class SujetoService {
  constructor(
    @InjectRepository(Sujeto)
    private readonly sujetoRepository: Repository<Sujeto>,
  ) { }

  async create(createSujetoDto: CreateSujetoDto): Promise<SujetoResponseDto> {
    await this.sujetoRepository.upsert(
      {
        cuit: createSujetoDto.cuit,
        denominacion: createSujetoDto.denominacion,
      },
      ['cuit'],
    );

    const created = await this.sujetoRepository.findOneBy({
      cuit: createSujetoDto.cuit,
    });

    if (!created) throw new ConflictException('El CUIT ya existe');

    return this.mapToResponseDto(created);
  }

  // easier to edit mappings in one place in case dto changes
  private mapToResponseDto(sujeto: Sujeto): SujetoResponseDto {
    return {
      id: sujeto.id,
      cuit: sujeto.cuit,
      denominacion: sujeto.denominacion,
      createdAt: sujeto.createdAt,
      updatedAt: sujeto.updatedAt,
    };
  }
}
