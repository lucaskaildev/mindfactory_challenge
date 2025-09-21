import { IsString, IsNotEmpty, Length, IsDefined } from 'class-validator';
import { IsValidCuit } from '@/validators/decorators/is-valid-cuit.decorator';

export class CreateSujetoDto {
  @IsDefined({ message: 'CUIT es requerido' })
  @IsNotEmpty({ message: 'CUIT es requerido' })
  @IsString({ message: 'CUIT debe ser una cadena de texto' })
  @Length(11, 11, { message: 'CUIT debe tener exactamente 11 dígitos' })
  @IsValidCuit({ message: 'CUIT no es válido' })
  cuit: string;

  @IsDefined({ message: 'Denominación es requerida' })
  @IsNotEmpty({ message: 'Denominación es requerida' })
  @IsString({ message: 'Denominación debe ser una cadena de texto' })
  @Length(1, 160, { message: 'Denominación no puede exceder 160 caracteres' })
  denominacion: string;
}
