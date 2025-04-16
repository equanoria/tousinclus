import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsObject, IsString } from 'class-validator';

export enum ErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
}

export class ResponseDTO {
  @IsString()
  @ApiPropertyOptional({
    description: 'Response message',
    example: 'Operation completed successfully',
  })
  message?: string;

  @IsString()
  @ApiPropertyOptional({
    description: 'Error code if any error occurred',
    example: 'NOT_FOUND',
    enum: ErrorCode,
  })
  errorCode?: ErrorCode | string;

  @IsObject()
  @ApiPropertyOptional({
    description: 'Additional data returned',
    example: { id: 1, value: 'example' },
  })
  errors?: object;
}

export class HTTPResponseDTO extends ResponseDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'HTTP status code of the response',
    example: 200,
  })
  statusCode: number;
}

export class WSResponseDTO extends ResponseDTO {
  @IsNotEmpty()
  @ApiProperty({
    description: 'WebSocket response status',
    example: 'success',
    enum: ['success', 'error', 'failed', 'forbidden'],
  })
  status: 'success' | 'error' | 'failed' | 'forbidden';
  responseChannel?: string;
}
