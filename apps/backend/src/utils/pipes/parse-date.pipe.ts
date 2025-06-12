// parse-date.pipe.ts
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: string): Date {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(
        `${value} is not a valid date. Please provide a date in the format YYYY-MM-DD.`,
      );
    }
    return date;
  }
}
