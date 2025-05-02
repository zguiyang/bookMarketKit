import {
  PipeTransform,
  Injectable,
  BadRequestException,
  Type,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor(private readonly type: Type<any>) {}

  async transform(value: any) {
    if (!value) {
      throw new BadRequestException('No data submitted');
    }

    const object = plainToInstance(this.type, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: this.formatErrors(errors),
      });
    }

    return object;
  }

  private formatErrors(errors: ValidationError[]): Record<string, string[]> {
    return errors.reduce(
      (acc, error) => {
        acc[error.property] = Object.values(error.constraints || {});
        return acc;
      },
      {} as Record<string, string[]>,
    );
  }
}
