import { AuthUser, VueAuthStore } from '../../interfaces';
import { IVueAuthOptions } from '../auth';

export default class StoreCookie extends VueAuthStore {
  public readonly enabled: boolean;
  private readonly documentCookie: boolean;

  constructor(Vue: any, options: IVueAuthOptions) {
    super(Vue, options);
    this.documentCookie = false;
    this.enabled = true;
    try {
      if (this.Vue.cookie) {
        this.store = this.Vue.cookie;
      } else if (typeof document.cookie === 'string') {
        this.documentCookie = true;
      }
    } catch (_) {
      console.warn('[vue-auth-plugin]: Cookie store not enabled');
      this.enabled = false;
    }
    this.initVue();
  }

  public getRoles(): string[] {
    const user = this.getUser();
    return user && this.options.rolesVar && user[this.options.rolesVar];
  }

  public getToken(): string {
    return this.getCookie(this.options.tokenDefaultName);
  }

  public getUser(): AuthUser {
    return this.getCookie(this.options.userDefaultName);
  }

  public setToken(token: string | null): void {
    if (token) {
      this.setCookie(this.options.tokenDefaultName, token);
    } else {
      this.deleteCookie(this.options.tokenDefaultName);
    }
  }

  public setUser(user: AuthUser | null): void {
    if (user && Object.keys(user).length) {
      this.setCookie(this.options.userDefaultName, user);
    } else {
      this.deleteCookie(this.options.userDefaultName);
    }
  }

  private getCookie(name?: string) {
    if (!name || !this.enabled) {
      return;
    }
    let result;
    if (!this.documentCookie) {
      result = this.store.get(name);
    } else {
      const cookiePair = document.cookie.replace(/;\s+/g, ';')
        .split(';')
        .map((str) => str.replace(/\s+=\s+/g, '=').split('='))
        .filter((cookiePair) => cookiePair[0] === name)
        .pop() || [];
      result = cookiePair[1] || null;
    }
    try {
      return JSON.parse(result);
    } catch (_) {
      return result;
    }
  }

  private setCookie(name: string | undefined, value: any) {
    if (!name || !this.enabled) {
      return;
    }
    value = JSON.stringify(value);
    if (!this.documentCookie) {
      this.store.set(name, value);
    } else {
      document.cookie = `${name}=${value}`;
    }
  }

  private deleteCookie(name: string | undefined) {
    if (!name || !this.enabled) {
      return;
    }
    if (!this.documentCookie) {
      this.store.delete(name);
    } else {
      document.cookie = `${name}=`;
    }
  }
}
