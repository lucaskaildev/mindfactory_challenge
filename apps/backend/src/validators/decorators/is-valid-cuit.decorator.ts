import { ValidationOptions } from 'class-validator';
import { useDecoratorFactory } from '@/validators/decorators/decorator.factory';
import { CuitValidator } from '@/validators/cuit.validator';

export function IsValidCuit(validationOptions?: ValidationOptions) {
  return useDecoratorFactory('IsValidCuit', CuitValidator, validationOptions);
}
