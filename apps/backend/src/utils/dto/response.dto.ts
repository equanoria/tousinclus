import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class IResponseDTO {
  @IsString()
  @ApiPropertyOptional({
    description: 'Response message',
    example: 'Operation completed successfully',
  })
  message?: string;

  @IsString()
  @ApiPropertyOptional({
    description: 'Error message if any error occurred',
    example: 'Internal error',
  })
  error?: string;

  @IsObject()
  @ApiPropertyOptional({
    description: 'Additional data returned',
    example: { id: 1, value: 'example' },
  })
  data?: object;
}

export class IHTTPResponseDTO extends IResponseDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'HTTP status code of the response',
    example: 200,
  })
  statusCode: number;
}

export class IWSResponseDTO extends IResponseDTO {
  @IsNotEmpty()
  @ApiProperty({
    description: 'WebSocket response status',
    example: 'success',
    enum: ['success', 'error', 'failed', 'forbidden'],
  })
  status: 'success' | 'error' | 'failed' | 'forbidden';
}
