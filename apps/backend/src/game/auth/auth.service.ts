import { createDirectus, readMe, rest, withToken } from '@directus/sdk';
import { Injectable } from '@nestjs/common';
import { DirectusService } from 'src/directus/directus.service';

interface IReadme {
  id: string;
}

@Injectable()
export class AuthService {
  private readonly directusClient = createDirectus(
    this.directusService.getDirectusUrl(),
  ).with(rest());

  constructor(private readonly directusService: DirectusService) {}

  async getUserId(accessToken: string): Promise<IReadme> {
    const user = await this.directusClient.request<IReadme>(
      withToken(accessToken, readMe()),
    );

    return user;
  }
}
