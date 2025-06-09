import type { IDirectusError } from '../types/Directus';

export const isDirectusError = (error: unknown): error is IDirectusError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'errors' in error &&
    Array.isArray((error as { errors?: unknown }).errors)
  );
};
