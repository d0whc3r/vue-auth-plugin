import { VueConstructor } from 'vue';
import { VueAuthStore } from '../../interfaces/VueAuthStore';
import { AuthUser, VueAuthOptions } from '../../interfaces/VueAuthOptions';

export default class StoreLocalStorage implements VueAuthStore {
  public store: Storage;

  constructor(protected Vue: VueConstructor, protected options: VueAuthOptions) {
    this.store = window.localStorage;
  }

  getRoles(): string[] {
    return this.getUser()[this.options.rolesVar];
  }

  getToken(): string {
    return this.store.getItem(this.options.tokenDefaultName);
  }

  getUser(): AuthUser {
    return JSON.parse(this.store.getItem(this.options.userDefaultName)) || {};
  }

  setToken(token: string): void {
    if (token) {
      this.store.setItem(this.options.tokenDefaultName, token);
    } else {
      this.store.removeItem(this.options.tokenDefaultName);
    }
  }

  setUser(user: AuthUser): void {
    if (user && Object.keys(user)) {
      this.store.setItem(this.options.userDefaultName, JSON.stringify(user));
    } else {
      this.store.removeItem(this.options.userDefaultName);
    }
  }

}
