import { ValidationOptions } from 'class-validator';
import { useDecoratorFactory } from '@/validators/decorators/decorator.factory';
import { DominioValidator } from '@/validators/dominio.validator';

export function IsValidDominio(validationOptions?: ValidationOptions) {
  return useDecoratorFactory(
    'IsValidDominio',
    DominioValidator,
    validationOptions,
  );
}
