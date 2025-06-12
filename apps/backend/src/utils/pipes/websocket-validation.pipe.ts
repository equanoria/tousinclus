import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { ErrorCode, WSResponseDTO } from '../dto/response.dto';

@Injectable()
export class WebsocketValidationPipe implements PipeTransform {
  constructor(private readonly responseChannel?: string) {
    this.responseChannel = responseChannel || 'exception';
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidUnknownValues: true,
      stopAtFirstError: false,
    });

    if (errors.length > 0) {
      const formattedErrors = this.formatErrorsDeep(errors);

      const errorObject: WSResponseDTO = {
        status: 'error',
        errorCode: ErrorCode.VALIDATION_FAILED,
        message: 'Validation failed. See errors for further details.',
        responseChannel: this.responseChannel,
        errors: formattedErrors,
      };

      throw new WsException(errorObject);
    }

    return object;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private formatErrorsDeep(errors: ValidationError[], parentPath = ''): any[] {
    return errors.flatMap((err) => {
      const path = parentPath ? `${parentPath}.${err.property}` : err.property;

      const currentError = err.constraints
        ? [{ property: path, constraints: err.constraints }]
        : [];

      const childErrors = err.children?.length
        ? this.formatErrorsDeep(err.children, path)
        : [];

      return [...currentError, ...childErrors];
    });
  }
}
