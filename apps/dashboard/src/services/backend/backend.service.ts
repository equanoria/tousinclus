import type { IGame } from '@tousinclus/types';
import { urlValidator } from '../../utils/urlValidator';
import { authService } from '../auth/auth.service';
import type { ICreateGames } from './interfaces/CreateGames';

class BackendService {
  private readonly backendUrl = urlValidator(
    window.env.BACKEND_URL,
    'http://localhost:3001/api',
  );

  private async request<TResponse = unknown, TBody = unknown>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    body?: TBody,
  ): Promise<TResponse> {
    const user = await authService.getUser();
    const url = `${this.backendUrl}/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.token || ''}`,
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      throw response;
    }

    return response.json();
  }

  private get<T = unknown>(endpoint: string): Promise<T> {
    return this.request<T>('GET', endpoint);
  }

  // private post<TResponse = unknown, TBody = unknown>(
  //   endpoint: string,
  //   body: TBody,
  // ): Promise<TResponse> {
  //   return this.request<TResponse, TBody>('POST', endpoint, body);
  // }

  private put<TResponse = unknown, TBody = unknown>(
    endpoint: string,
    body: TBody,
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>('PUT', endpoint, body);
  }

  private delete<T = unknown>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint);
  }

  // private patch<TResponse = unknown, TBody = unknown>(
  //   endpoint: string,
  //   body: TBody,
  // ): Promise<TResponse> {
  //   return this.request<TResponse, TBody>('PATCH', endpoint, body);
  // }

  async getAllGames(): Promise<IGame[]> {
    return this.get<IGame[]>('/game');
  }

  async createGames(gamesTemplate: ICreateGames, count = 1): Promise<IGame[]> {
    return this.put<IGame[]>(`/game/${count}`, gamesTemplate);
  }

  async deleteGame(code: string): Promise<void> {
    return this.delete(`/game/${code}`);
  }

  async exportGames(date: Date): Promise<Blob> {
    const formattedDate = date.toISOString().split('T')[0];
    const url = `/game/export/${formattedDate}.csv`;
    const user = await authService.getUser();
    const headers: HeadersInit = {
      Authorization: `Bearer ${user?.token || ''}`,
    };
    const response = await fetch(
      `${this.backendUrl}/${url.startsWith('/') ? url.slice(1) : url}`,
      { method: 'GET', headers },
    );
    if (!response.ok) {
      throw response;
    }
    return response.blob();
  }
}

export const backendService = new BackendService();
