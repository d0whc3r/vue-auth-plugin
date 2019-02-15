import { VueConstructor } from 'vue';
import { AuthUser, VueAuthOptions } from '@/interfaces/VueAuthOptions';
import { VueAuthStore } from '@/interfaces/VueAuthStore';
import { StoreVuex } from '@/lib/store/store-vuex';
import StoreCookie from '@/lib/store/store-cookie';
import StoreLocalStorage from '@/lib/store/store-local-storage';
import StoreSessionStorage from '@/lib/store/store-session-storage';

export type StoreType = StoreCookie | StoreSessionStorage | StoreVuex | StoreLocalStorage;

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
          case 'vuex':
            return new StoreVuex(this.Vue, this.options);
            break;
          default:
            return new StoreLocalStorage(this.Vue, this.options);
        }
      });
  }

  getRoles(): string[] {
    return this.getStores()
      .map((store) => store.getRoles())
      .filter((roles) => roles.length)[0];
  }

  getToken(): string {
    return this.getStores()
      .map((store) => store.getToken())
      .filter((token) => !!token)[0];
  }

  getUser(): AuthUser {
    return this.getStores()
      .map((store) => store.getUser())
      .filter((user) => !!user)[0];
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

}
