import { SujetoResponseDto } from '../../sujeto/dto';

export class ObjetoDeValorResponseDto {
  id: number;
  tipo: string;
  codigo: string;
  descripcion?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AutomotorResponseDto {
  id: number;
  dominio: string;
  numeroChasis?: string;
  numeroMotor?: string;
  color?: string;
  fechaFabricacion: number;
  fechaAltaRegistro: Date;

  dueno?: SujetoResponseDto;

  objetoValor: ObjetoDeValorResponseDto;
}
