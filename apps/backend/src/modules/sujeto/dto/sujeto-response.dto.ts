import { Expose } from 'class-transformer';

export class SujetoResponseDto {
  @Expose() cuit: string;
  @Expose() denominacion: string;
}
