import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ValidationPipe, ValidationError } from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]): HttpException => {
        const errorMessages = errors.map((err: ValidationError) => ({
          field: err.property,
          message: err.constraints
            ? Object.values(err.constraints)[0]
            : 'Unknown validation error',
          value: typeof err.value == 'string' ? err.value : '',
        }));

        return new HttpException(
          {
            message: 'Validation failed',
            errors: errorMessages,
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      },
    });
  }
}
