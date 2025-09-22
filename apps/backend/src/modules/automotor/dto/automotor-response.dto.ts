import { Expose, Type } from 'class-transformer';

export class DuenoDto {
  @Expose() cuit: string;
  @Expose() denominacion: string;
}

export class AutomotorResponseDto {
  @Expose() dominio: string;
  @Expose() numeroChasis?: string;
  @Expose() numeroMotor?: string;
  @Expose() color?: string;
  @Expose() fechaFabricacion: number;

  @Expose()
  @Type(() => DuenoDto)
  dueno?: DuenoDto;
}
