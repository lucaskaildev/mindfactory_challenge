import { Controller, Post, Body } from '@nestjs/common';
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
}
