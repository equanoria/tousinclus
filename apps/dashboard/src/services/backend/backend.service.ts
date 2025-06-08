import type { IGame } from '@tousinclus/types';
import { urlValidator } from '../../utils/urlValidator';
import { authService } from '../auth/auth.service';
import type { ICreateGames } from './interfaces/CreateGames';

class BackendService {
  private readonly backendUrl = urlValidator(window.env.BACKEND_URL, 'http://localhost:3001/api');

  private async request<TResponse = unknown, TBody = unknown>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    body?: TBody
  ): Promise<TResponse> {
    const user = await authService.getUser();
    const url = `${this.backendUrl}/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user?.token || ''}`,
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  private get<T = unknown>(endpoint: string): Promise<T> {
    return this.request<T>('GET', endpoint);
  }

  private post<TResponse = unknown, TBody = unknown>(endpoint: string, body: TBody): Promise<TResponse> {
    return this.request<TResponse, TBody>('POST', endpoint, body);
  }

  private put<TResponse = unknown, TBody = unknown>(endpoint: string, body: TBody): Promise<TResponse> {
    return this.request<TResponse, TBody>('PUT', endpoint, body);
  }

  private delete<T = unknown>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint);
  }

  private patch<TResponse = unknown, TBody = unknown>(endpoint: string, body: TBody): Promise<TResponse> {
    return this.request<TResponse, TBody>('PATCH', endpoint, body);
  }

  async getAllGames(): Promise<IGame[]> {
    return this.get<IGame[]>('/game');
  }

  async createGames(gamesTemplate: ICreateGames, count = 1): Promise<IGame[]> {
    return this.post<IGame[]>(`/game/${count}`, gamesTemplate);
  }
}

export const backendService = new BackendService();
