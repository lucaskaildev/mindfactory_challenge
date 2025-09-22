import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  NotFoundException,
  Put,
  Delete,
} from '@nestjs/common';
import { AutomotorService } from './automotor.service';
import { CreateAutomotorDto, UpdateAutomotorDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { AutomotorResponseDto } from './dto/automotor-response.dto';
import { AutomotorConDuenoView } from '@/entities';

@Controller('automotores')
export class AutomotorController {
  constructor(private readonly automotorService: AutomotorService) { }

  private toResponse(view: AutomotorConDuenoView): AutomotorResponseDto {
    const plain = {
      dominio: view.dominio,
      numeroChasis: view.numeroChasis ?? undefined,
      numeroMotor: view.numeroMotor ?? undefined,
      color: view.color ?? undefined,
      fechaFabricacion: view.fechaFabricacion,
      dueno: view.cuitDueno
        ? {
          cuit: view.cuitDueno,
          denominacion: view.denominacionDueno ?? '',
        }
        : undefined,
    };
    return plainToInstance(AutomotorResponseDto, plain, {
      excludeExtraneousValues: true,
    }) as AutomotorResponseDto;
  }

  @Get()
  async list(): Promise<AutomotorResponseDto[]> {
    const rows = await this.automotorService.findAll();
    return rows.map((r) => this.toResponse(r));
  }

  @Get(':dominio')
  async getByDominio(
    @Param('dominio') dominio: string,
  ): Promise<AutomotorResponseDto> {
    const automotor = await this.automotorService.findByDominio(dominio);
    if (!automotor) {
      throw new NotFoundException('Automotor no encontrado');
    }
    return this.toResponse(automotor);
  }

  @Post()
  async create(@Body() dto: CreateAutomotorDto): Promise<AutomotorResponseDto> {
    const created = await this.automotorService.createOrUpdate(dto);
    return this.toResponse(created);
  }

  @Put(':dominio')
  async update(
    @Param('dominio') dominio: string,
    @Body() dto: UpdateAutomotorDto,
  ): Promise<AutomotorResponseDto> {
    // ensure controller validates update intent: dominio path must match body if provided
    const updateDto: UpdateAutomotorDto = { ...dto, dominio };
    const updated = await this.automotorService.createOrUpdate(updateDto);
    return this.toResponse(updated);
  }

  @Delete(':dominio')
  async remove(@Param('dominio') dominio: string): Promise<void> {
    const deleted = await this.automotorService.deleteByDominio(dominio);
    if (!deleted) {
      throw new NotFoundException('Automotor no encontrado');
    }
  }
}
