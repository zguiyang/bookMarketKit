import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

@Injectable()
export class DrizzleValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {} // 显式声明 schema 的类型

  transform(value: any) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        throw new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      }
      throw new BadRequestException({
        message: 'Validation failed',
        errors: error.message || 'Unknown validation error',
      });
    }
  }
}
