import { VueConstructor } from 'vue';
import { AuthUser, VueAuthOptions } from '../interfaces/VueAuthOptions';
import { VueAuthStore } from '../interfaces/VueAuthStore';
import StoreCookie from './store/store-cookie';
import StoreLocalStorage from './store/store-local-storage';
import StoreSessionStorage from './store/store-session-storage';

export type StoreType = StoreCookie | StoreSessionStorage | StoreLocalStorage;

export default class AuthStoreManager implements VueAuthStore {
  private stores: StoreType[];

  constructor(private Vue: VueConstructor, private options: VueAuthOptions) {
    this.setStores();
  }

  getStores() {
    return [...this.stores];
  }

  setStores() {
    this.stores = Object.assign([], this.options.tokenStore)
      .map((store) => {
        switch (store) {
          case 'cookie':
            return new StoreCookie(this.Vue, this.options);
            break;
          case 'sessionStorage':
            return new StoreSessionStorage(this.Vue, this.options);
            break;
          default:
            return new StoreLocalStorage(this.Vue, this.options);
        }
      });
  }

  getRoles(): string[] {
    return this.getStores()
      .map((store) => store.getRoles())
      .filter((roles) => roles && roles.length)[0];
  }

  getToken(): string {
    return this.getStores()
      .map((store) => store.getToken())
      .filter((token) => !!token)[0];
  }

  getUser(): AuthUser {
    return this.getStores()
      .map((store) => store.getUser())
      .filter((user) => !!user)[0] || {};
  }

  setToken(token: string): void {
    this.getStores()
      .forEach((store) => {
        store.setToken(token);
      });
  }

  setUser(user: AuthUser): void {
    this.getStores()
      .forEach((store) => {
        store.setUser(user);
      });
  }

  resetAll(): void {
    this.setUser(null);
    this.setToken(null);
  }

  checkRole(role?: string | string[]): boolean {
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
