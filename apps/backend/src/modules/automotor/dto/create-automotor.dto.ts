import {
  IsString,
  IsOptional,
  IsInt,
  IsNotEmpty,
  Length,
} from 'class-validator';
import { IsValidCuit } from '@/validators/decorators/is-valid-cuit.decorator';
import { IsValidFechaDeFabricacion } from '@/validators/decorators/is-valid-fecha-de-fabricacion.decorator';
import { IsValidDominio } from '@/validators/decorators/is-valid-dominio.decorator';
import { Transform } from 'class-transformer';

export class CreateAutomotorDto {
  @IsNotEmpty({ message: 'Dominio es requerido' })
  @IsString({ message: 'Dominio debe ser una cadena de texto' })
  @IsValidDominio({ message: 'Dominio no es válido' })
  @Transform(({ value }) => String(value).trim().toUpperCase())
  dominio: string;

  @IsOptional()
  @IsString({ message: 'Número de chasis debe ser una cadena de texto' })
  @Length(1, 25, { message: 'Número de chasis no puede exceder 25 caracteres' })
  numeroChasis?: string;

  @IsOptional()
  @IsString({ message: 'Número de motor debe ser una cadena de texto' })
  @Length(1, 25, { message: 'Número de motor no puede exceder 25 caracteres' })
  numeroMotor?: string;

  @IsOptional()
  @IsString({ message: 'Color debe ser una cadena de texto' })
  @Length(1, 40, { message: 'Color no puede exceder 40 caracteres' })
  color?: string;

  @IsNotEmpty({ message: 'Fecha de fabricación es requerida' })
  @IsInt({ message: 'Fecha de fabricación debe ser un número entero' })
  @IsValidFechaDeFabricacion({ message: 'Fecha de fabricación no es válida' })
  fechaFabricacion: number;

  @IsNotEmpty({ message: 'CUIT del dueño es requerido' })
  @IsString({ message: 'CUIT debe ser una cadena de texto' })
  @Length(11, 11, { message: 'CUIT debe tener exactamente 11 dígitos' })
  @IsValidCuit({ message: 'CUIT no es válido' })
  cuitDuenio: string;
}
