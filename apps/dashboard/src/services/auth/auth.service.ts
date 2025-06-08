import { readMe } from '@directus/sdk';
import type { IDirectusUser } from '@tousinclus/types';
import type { TUser } from '../../types/User';
import { directusService } from '../directus/directus.service';

export interface ICredentials {
  email: string;
  password: string;
}

class AuthService {
  private readonly directusClient = directusService.directusClient;
  private _user: TUser | null = null;

  async login({ email, password }: ICredentials): Promise<TUser> {
    await this.directusClient.login(email, password);

    const [token, directusUser] = await Promise.all([
      this.directusClient.getToken(),
      this.getDirectusUserMe(),
    ]);

    if (!token) {
      throw new Error('Token is missing after login');
    }

    this._user = { ...directusUser, token };
    return this._user;
  }

  async logout(): Promise<void> {
    await this.directusClient.logout();
    this._user = null;
  }

  async getUser(): Promise<TUser | null> {
    const token = await this.directusClient.getToken();
    if (!token) return null;

    const user = await this.getDirectusUserMe();
    this._user = { ...user, token };
    return this._user;
  }

  private async getDirectusUserMe(): Promise<IDirectusUser> {
    return this.directusClient.request<IDirectusUser>(readMe());
  }
}

export const authService = new AuthService();
