import { VueAuthStore } from '@/interfaces/VueAuthStore';
import { AuthUser, VueAuthOptions } from '@/interfaces/VueAuthOptions';
import { VueConstructor } from 'vue';

export default class StoreLocalstorage implements VueAuthStore {
  public store: Storage;

  constructor(private Vue: VueConstructor, private options: VueAuthOptions) {
    this.store = window.localStorage;
  }

  getRoles(): string[] {
    return this.getUser()[this.options.rolesVar];
  }

  getToken(): string {
    return this.store.getItem(this.options.tokenDefaultName);
  }

  getUser(): AuthUser {
    return JSON.parse(this.store.getItem(this.options.userDefaultName));
  }

  setToken(token: string): void {
    this.store.setItem(this.options.tokenDefaultName, token);
  }

  setUser(user: AuthUser): void {
    this.store.setItem(this.options.userDefaultName, JSON.stringify(user));
  }

}
