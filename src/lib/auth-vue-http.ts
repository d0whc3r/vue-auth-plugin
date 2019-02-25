import { AxiosInstance } from 'axios';
import { VueAuthLogin } from '../interfaces';
import AuthStoreManager from './auth-vue-store-manager';
import AuthVueRouter from './auth-vue-router';
import { IVueAuthOptions } from './auth';

export default class AuthVueHttp {
  private readonly http: AxiosInstance;
  private interval: any;

  constructor(
    private readonly Vue: any,
    private readonly options: IVueAuthOptions,
    private readonly storeManager: AuthStoreManager,
    private readonly router: AuthVueRouter) {
    if (!this.Vue.axios) {
      throw Error('[vue-auth-plugin] vue-axios is a required dependency');
    }
    this.http = Vue.axios as AxiosInstance;
    this.configureHttp();
  }

  public login(loginInfo: VueAuthLogin) {
    const { method, url, redirect, fetchUser } = this.options.loginData;
    return this.http({
      method,
      url,
      data: loginInfo,
    })
      .then(async (response) => {
        const { headers } = response;
        this.extractToken(headers);
        this.startRefresh();
        if (fetchUser) {
          await this.fetchData(true);
        }
        if (redirect) {
          this.router.push(redirect);
        }
        return response;
      })
      .catch((error) => {
        console.warn('[vue-auth-plugin] Login error', error.message);
      });
  }

  public logout(forceRedirect = false) {
    const logout = this.options.logoutData && typeof this.options.logoutData === 'object' &&
    Object.keys(this.options.logoutData).length ? this.options.logoutData : {};
    const { url, method, redirect, makeRequest } = logout;
    if (makeRequest) {
      this.http({
        method,
        url,
        headers: { ...this.getAuthHeader() },
      });
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.storeManager.resetAll();
    if (redirect || forceRedirect) {
      this.router.push(redirect || '/');
    }
  }

  public fetchData(force = false) {
    const fetch = this.options.fetchData && typeof this.options.fetchData === 'object' &&
    Object.keys(this.options.fetchData).length ? this.options.fetchData : {};
    const { enabled, method, url } = fetch;
    if ((enabled || force) && url && method && this.storeManager.getToken()) {
      return this.http({
        method,
        url,
        headers: { ...this.getAuthHeader() },
      })
        .then(({ data }) => {
          this.storeManager.setUser(data.user || data);
          return data;
        })
        .catch((error) => {
          console.warn('[vue-auth-plugin] Fetching user error', error.message);
        });
    }
    return Promise.resolve(null);
  }

  private configureHttp() {
    this.http.interceptors.request.use((request) => {
      if (request.headers) {
        Object.keys(request.headers)
          .forEach((head) => {
            const value: string = request.headers[head];
            if (value && typeof value === 'string' && value.includes(this.options.headerTokenReplace)) {
              request.headers[head] = value.replace(this.options.headerTokenReplace, this.storeManager.getToken());
            }
          });
      }
      return request;
    }, (error) => {
      return Promise.reject(error);
    });
    this.http.interceptors.response.use((response) => {
      return response;
    }, (error) => {
      const status = error && error.response && error.response.status;
      if (status === 401) {
        this.logout();
      }
      return Promise.reject(error);
    });
  }

  private startRefresh() {
    const { interval } = this.options.fetchData;
    if (!this.interval) {
      this.interval = setInterval(() => {
        this.fetchData();
      }, interval * 60 * 1000);
    }
  }

  private extractToken(headers: { [head: string]: string }) {
    const { headerToken } = this.options.loginData;
    const head = (headers[headerToken.toLowerCase()] || '').split(' ');
    const token = head[1] || head[0];
    this.storeManager.setToken(token.trim());
  }

  private getAuthHeader() {
    const { headerToken } = this.options.loginData;
    const { tokenType, headerTokenReplace } = this.options;

    const token = `${tokenType} ${headerTokenReplace}`.trim();
    return { [headerToken]: token };
  }
}
