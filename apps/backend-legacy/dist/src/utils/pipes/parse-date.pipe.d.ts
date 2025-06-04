import { PipeTransform } from '@nestjs/common';
export declare class ParseDatePipe implements PipeTransform {
    transform(value: string): Date;
}
