import { IsNumber, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class IResponseDTO {
  @IsString()
  message?: string;

  @IsString()
  error?: string;

  @IsObject()
  data?: object;
}

export class IHTTPResponseDTO extends IResponseDTO {
  @IsNotEmpty()
  @IsNumber()
  statusCode: number;
}

export class IWSResponseDTO extends IResponseDTO {
  @IsNotEmpty()
  status: 'success' | 'error' | 'failed' | 'forbidden';
}
