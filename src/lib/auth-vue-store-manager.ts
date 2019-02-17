import { VueConstructor } from 'vue';
import { AuthUser, TokenStore, VueAuthStore } from '../interfaces';
import { StoreCookie, StoreLocalStorage, StoreSessionStorage, StoreVuex } from './store';
import { IVueAuthOptions } from './auth';

export type StoreType = StoreVuex | StoreCookie | StoreSessionStorage | StoreLocalStorage;

export default class AuthStoreManager extends VueAuthStore {
  private stores: StoreType[];

  constructor(Vue: VueConstructor, options: IVueAuthOptions) {
    super(Vue, options);
    this.setStores();
    this.options.watch.$watch('user', (value) => {
      this.setUser(value);
    });
    this.options.watch.$watch('token', (value) => {
      this.setToken(value);
    });
  }

  public get allStores() {
    return [...this.stores];
  }

  public setStores() {
    this.stores = Object.assign([], this.options.tokenStore)
      .map((store: TokenStore) => {
        switch (store) {
          case 'cookie':
            const cookieStore = new StoreCookie(this.Vue, this.options);
            if (cookieStore.enabled) {
              return cookieStore;
            } else {
              return null;
            }
          case 'sessionStorage':
            return new StoreSessionStorage(this.Vue, this.options);
          case 'vuex':
            return new StoreVuex(this.Vue, this.options);
          default:
            return new StoreLocalStorage(this.Vue, this.options);
        }
      })
      .filter((store) => !!store);
  }

  public getRoles(): string[] {
    return this.allStores
      .map((store) => store.getRoles())
      .filter((roles) => roles && roles.length)[0];
  }

  public getToken(): string {
    const token = this.allStores
      .map((store) => store.getToken())
      .filter((token) => !!token)[0];
    return token || this.options.watch.$data.token;
  }

  public getUser(): AuthUser {
    const user = this.allStores
      .map((store) => store.getUser())
      .filter((user) => !!user)[0];
    return Object.keys(user).length && user || this.options.watch.$data.user || {};
  }

  public setToken(token: string): void {
    this.allStores
      .forEach((store) => {
        store.setToken(token);
      });
    this.options.watch.$data.token = token;
  }

  public setUser(user: AuthUser): void {
    this.allStores
      .forEach((store) => {
        store.setUser(user);
      });
    this.options.watch.$data.user = user;
  }

  public resetAll(): void {
    this.setUser(null);
    this.setToken(null);
    this.options.watch.$data.user = null;
    this.options.watch.$data.token = null;
  }

  public checkRole(role?: string | string[]): boolean {
    if (role) {
      const roles = this.getRoles();
      if (!roles) {
        return false;
      }
      if (Array.isArray(role)) {
        return roles.some((authrole) => role.includes(authrole));
      } else {
        return roles.includes(role);
      }
    } else {
      return !!this.getToken();
    }
  }
}
