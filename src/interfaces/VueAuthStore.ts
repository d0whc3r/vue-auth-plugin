import { AuthUser } from '@/interfaces/VueAuthOptions';

export interface VueAuthStore {
  getUser(): AuthUser;

  setUser(user: AuthUser): void;

  getToken(): string;

  setToken(token: string): void;

  getRoles(): string[];
}
