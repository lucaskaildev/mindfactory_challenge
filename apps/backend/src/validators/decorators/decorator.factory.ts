import { registerDecorator, ValidationOptions } from 'class-validator';

export function useDecoratorFactory(
  name: string,
  validatorClass: { isValid: (value: any) => boolean },
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name,
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any): boolean | Promise<boolean> {
          return validatorClass.isValid(value);
        },
      },
    });
  };
}
