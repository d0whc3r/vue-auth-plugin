import { VueConstructor } from 'vue';
import { AuthUser, VueAuthOptions, VueAuthStore } from '../../interfaces';

export default class StoreLocalStorage implements VueAuthStore {
  public store: Storage;

  constructor(protected Vue: VueConstructor, protected options: VueAuthOptions) {
    this.store = window.localStorage;
  }

  public getRoles(): string[] {
    return this.getUser()[this.options.rolesVar];
  }

  public getToken(): string {
    return this.store.getItem(this.options.tokenDefaultName);
  }

  public getUser(): AuthUser {
    return JSON.parse(this.store.getItem(this.options.userDefaultName)) || {};
  }

  public setToken(token: string): void {
    if (token) {
      this.store.setItem(this.options.tokenDefaultName, token);
    } else {
      this.store.removeItem(this.options.tokenDefaultName);
    }
  }

  public setUser(user: AuthUser): void {
    if (user && Object.keys(user)) {
      this.store.setItem(this.options.userDefaultName, JSON.stringify(user));
    } else {
      this.store.removeItem(this.options.userDefaultName);
    }
  }

}
