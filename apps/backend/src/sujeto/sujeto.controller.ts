import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { SujetoService } from '@/sujeto/sujeto.service';
import { CreateSujetoDto, SujetoResponseDto } from '@/sujeto/dto';

@Controller('/sujeto')
export class SujetoController {
  constructor(private readonly sujetoService: SujetoService) { }

  @Post()
  async create(
    @Body() createSujetoDto: CreateSujetoDto,
  ): Promise<SujetoResponseDto> {
    return await this.sujetoService.create(createSujetoDto);
  }

  @Get('by-cuit')
  async getByCuit(@Query('cuit') cuit: string): Promise<SujetoResponseDto> {
    if (!cuit) {
      throw new HttpException('CUIT es requerido', HttpStatus.BAD_REQUEST);
    }
    const sujeto = await this.sujetoService.findByCuit(cuit);
    if (!sujeto) {
      throw new HttpException(
        'No existe un sujeto con ese CUIT',
        HttpStatus.NOT_FOUND,
      );
    }
    return sujeto;
  }
}
