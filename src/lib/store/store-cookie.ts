import { AuthUser, VueAuthOptions, VueAuthStore } from '../../interfaces';

export default class StoreCookie implements VueAuthStore {
  private store: any;

  constructor(private Vue: any, private options: VueAuthOptions) {
    this.store = Vue.cookie;
  }

  getRoles(): string[] {
    return this.getUser()[this.options.rolesVar];
  }

  getToken(): string {
    return this.store.get(this.options.tokenDefaultName);
  }

  getUser(): AuthUser {
    return JSON.parse(this.store.get(this.options.userDefaultName)) || {};
  }

  setToken(token: string): void {
    if (token) {
      this.store.set(this.options.tokenDefaultName, token);
    } else {
      this.store.delete(this.options.tokenDefaultName);
    }
  }

  setUser(user: AuthUser): void {
    if (user && Object.keys(user).length) {
      this.store.set(this.options.userDefaultName, JSON.stringify(user));
    } else {
      this.store.delete(this.options.userDefaultName);
    }
  }

}
