import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class WebsocketValidationPipe implements PipeTransform {
    private readonly responseChannel?;
    constructor(responseChannel?: string);
    transform(value: any, metadata: ArgumentMetadata): Promise<any>;
    private toValidate;
    private formatErrorsDeep;
}
