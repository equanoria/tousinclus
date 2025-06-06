import { createDirectus, rest } from '@directus/sdk';
import { DirectusService, type ICredentials } from '../directus/directus.service';

export class AuthService extends DirectusService {
  protected readonly userDirectusClient;

  constructor() {
    super();
    this.userDirectusClient = createDirectus(this.directusBaseUrl).with(rest());
  }
    public async login({ email, password }: ICredentials): Promise<void> {
      return this.userDirectusClient.login(email, password);
    }
  }