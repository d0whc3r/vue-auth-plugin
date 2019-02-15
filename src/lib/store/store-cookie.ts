import { VueConstructor } from 'vue';
import * as Cookies from 'js-cookie';
import { VueAuthStore } from '@/interfaces/VueAuthStore';
import { AuthUser, VueAuthOptions } from '@/interfaces/VueAuthOptions';

export default class StoreCookie implements VueAuthStore {
  private store: Cookies.CookiesStatic;

  constructor(private Vue: VueConstructor, private options: VueAuthOptions) {
    this.store = Cookies;
  }

  getRoles(): string[] {
    return this.getUser()[this.options.rolesVar];
  }

  getToken(): string {
    return this.store.get(this.options.tokenDefaultName);
  }

  getUser(): AuthUser {
    return this.store.getJSON(this.options.userDefaultName);
  }

  setToken(token: string): void {
    this.store.set(this.options.tokenDefaultName, token);
  }

  setUser(user: AuthUser): void {
    this.store.set(this.options.userDefaultName, user);
  }

}
