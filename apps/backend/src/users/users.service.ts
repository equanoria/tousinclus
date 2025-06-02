import { Injectable, Logger } from '@nestjs/common';
import { IUser } from '@tousinclus/types';
import { DirectusService } from 'src/directus/directus.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly directusService: DirectusService) {}

  async findOne(id: string): Promise<IUser | undefined> {
    return this.users.find(user => user.username === username);
  }
}
