import { Injectable, Logger } from '@nestjs/common';
import { DirectusService } from 'src/directus/directus.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly directusService: DirectusService) {}
}
