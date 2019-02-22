import { AuthUser, VueAuthStore } from '../../interfaces';
import { IVueAuthOptions } from '../auth';

export default class StoreCookie extends VueAuthStore {
  public readonly enabled: boolean;
  private readonly documentCookie;

  constructor(Vue: any, options: IVueAuthOptions) {
    super(Vue, options);
    this.documentCookie = false;
    this.enabled = true;
    if (this.Vue.cookie) {
      this.store = this.Vue.cookie;
    } else if (typeof document.cookie === 'string') {
      this.documentCookie = true;
    } else {
      console.warn('[vue-auth-plugin]: Cookie store not enabled');
      this.enabled = false;
    }
    this.initVue();
  }

  public getRoles(): string[] {
    const user = this.getUser();
    return user && user[this.options.rolesVar];
  }

  public getToken(): string {
    return this.getCookie(this.options.tokenDefaultName);
  }

  public getUser(): AuthUser {
    return this.getCookie(this.options.userDefaultName);
  }

  public setToken(token: string): void {
    if (token) {
      this.setCookie(this.options.tokenDefaultName, token);
    } else {
      this.deleteCookie(this.options.tokenDefaultName);
    }
  }

  public setUser(user: AuthUser): void {
    if (user && Object.keys(user).length) {
      this.setCookie(this.options.userDefaultName, user);
    } else {
      this.deleteCookie(this.options.userDefaultName);
    }
  }

  private getCookie(name) {
    if (!this.documentCookie) {
      return JSON.parse(this.store.get(name));
    } else {
      const cookiePair = document.cookie.replace(/;\s+/g, ';')
        .split(';')
        .map((str) => str.replace(/\s+=\s+/g, '=').split('='))
        .filter((cookiePair) => cookiePair[0] === name)
        .pop() || [];
      const result = cookiePair[1] || null;
      try {
        return JSON.parse(result);
      } catch (_) {
        return result;
      }
    }
  }

  private setCookie(name, value) {
    value = JSON.stringify(value);
    if (!this.documentCookie) {
      this.store.set(name, value);
    } else {
      document.cookie = `${name}=${value}`;
    }
  }

  private deleteCookie(name) {
    if (!this.documentCookie) {
      this.store.delete(name);
    } else {
      document.cookie = `${name}=`;
    }
  }
}
