// websocket-validation.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
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

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const formattedErrors = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));

      // Créer un objet d'erreur avec le canal de réponse
      const errorObject: WSResponseDTO = {
        status: 'error',
        errorCode: ErrorCode.VALIDATION_FAILED,
        message: 'Validation failed. See errors for further details.',
        responseChannel: this.responseChannel || 'exception',
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
}
