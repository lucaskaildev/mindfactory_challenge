import { ValidationOptions } from 'class-validator';
import { useDecoratorFactory } from '@/validators/decorators/decorator.factory';
import { FechaFabricacionValidator } from '@/validators/fecha-fabricacion.validator';

export function IsValidFechaDeFabricacion(
  validationOptions?: ValidationOptions,
) {
  return useDecoratorFactory(
    'IsValidFechaDeFabricacion',
    FechaFabricacionValidator,
    validationOptions,
  );
}
