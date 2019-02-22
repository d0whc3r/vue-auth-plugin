import { VueConstructor } from 'vue';
import { AuthUser, VueAuthStore } from '../../interfaces';
import { IVueAuthOptions } from '../auth';

export default class StoreLocalStorage extends VueAuthStore {
  constructor(Vue: VueConstructor, options: IVueAuthOptions) {
    super(Vue, options);
    this.store = window.localStorage;
    this.initVue();
  }

  public getRoles(): string[] {
    const user = this.getUser();
    return user && user[this.options.rolesVar];
  }

  public getToken(): string {
    return this.store.getItem(this.options.tokenDefaultName);
  }

  public getUser(): AuthUser {
    return JSON.parse(this.store.getItem(this.options.userDefaultName));
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
