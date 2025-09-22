import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpStatus,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { SujetoService } from '@/modules/sujeto/sujeto.service';
import { CreateSujetoDto, SujetoResponseDto } from '@/modules/sujeto/dto';
import { Sujeto } from '@/entities/sujeto.entity';
import { plainToInstance } from 'class-transformer';

@Controller('/sujetos')
export class SujetoController {
  constructor(private readonly sujetoService: SujetoService) { }

  private toResponse(entity: Sujeto): SujetoResponseDto {
    return plainToInstance(
      SujetoResponseDto,
      { cuit: entity.cuit, denominacion: entity.denominacion },
      { excludeExtraneousValues: true },
    ) as SujetoResponseDto;
  }

  @Post()
  async create(
    @Body() createSujetoDto: CreateSujetoDto,
  ): Promise<SujetoResponseDto> {
    const created = await this.sujetoService.create(createSujetoDto);
    return this.toResponse(created);
  }

  @Get('by-cuit')
  async getByCuit(@Query('cuit') cuit: string): Promise<SujetoResponseDto> {
    if (!cuit) {
      throw new HttpException('CUIT es requerido', HttpStatus.BAD_REQUEST);
    }
    const sujeto = await this.sujetoService.findByCuit(cuit);
    if (!sujeto) {
      throw new NotFoundException('No existe un sujeto con ese CUIT');
    }
    return this.toResponse(sujeto);
  }
}
