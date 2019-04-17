import { AxiosInstance, AxiosResponse } from 'axios';
import { VueAuthLogin } from '../interfaces';
import AuthStoreManager from './auth-vue-store-manager';
import AuthVueRouter from './auth-vue-router';
import { IVueAuthOptions } from './auth';

export default class AuthVueHttp {
  private readonly http: AxiosInstance;
  private intervalFetchData = 0;
  private intervalRefreshData = 0;
  private readonly MINUTE_IN_MS = 60 * 1000;

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
    if (!this.options.loginData) {
      console.warn('[vue-auth-plugin] Login not configured, use "loginData" option');
      return Promise.reject(false);
    }
    const { method, url, redirect, fetchUser } = this.options.loginData;
    const promise = this.http({
      method,
      url,
      data: loginInfo,
    });
    promise
      .then(async (response: AxiosResponse) => {
        const { headers } = response;
        this.extractToken(headers);
        this.startIntervals();
        if (fetchUser) {
          await this.fetchData(true);
        }
        if (redirect) {
          this.router.push(redirect);
        }
        return response;
      })
      .catch((error: any) => {
        console.warn('[vue-auth-plugin] Login error', error.message);
      });
    return promise;
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
    if (this.intervalFetchData) {
      clearInterval(this.intervalFetchData);
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
      const promise = this.http({
        method,
        url,
        headers: { ...this.getAuthHeader() },
      });
      promise
        .then(({ data }) => {
          const { fetchItem } = this.options;
          this.storeManager.setUser(fetchItem ? data[fetchItem] : data);
          return data;
        })
        .catch((error: Error) => {
          console.warn('[vue-auth-plugin] Fetching user error', error.message);
        });
      return promise;
    }
    return Promise.resolve(null);
  }

  public refresh(force = false) {
    const refresh = this.options.refreshData && typeof this.options.refreshData === 'object' &&
    Object.keys(this.options.refreshData).length ? this.options.refreshData : {};
    const { enabled, method, url } = refresh;
    if ((enabled || force) && url && method && this.storeManager.getToken()) {
      const promise = this.http({
        method,
        url,
        headers: { ...this.getAuthHeader() },
      });
      promise
        .then(async (response: AxiosResponse) => {
          const { headers } = response;
          this.extractToken(headers);
          return response;
        })
        .catch((error: Error) => {
          console.warn('[vue-auth-plugin] Refresh error', error.message);
        });
      return promise;
    }
    return Promise.resolve(null);
  }

  private configureHttp() {
    this.http.interceptors.request.use((request) => {
      if (request.headers) {
        Object.keys(request.headers)
          .forEach((head) => {
            const value: string = request.headers[head];
            if (value
              && typeof value === 'string'
              && this.options.headerTokenReplace
              && value.includes(this.options.headerTokenReplace)) {
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

  private startIntervals() {
    this.startFetchDataInterval();
    this.startRefreshDataInterval();
  }

  private startFetchDataInterval(): void {
    if (!this.options.fetchData) {
      return;
    }
    const { interval } = this.options.fetchData;
    if (interval && !this.intervalFetchData) {
      this.intervalFetchData = setInterval(() => {
        this.fetchData();
      }, interval * this.MINUTE_IN_MS);
    }
  }

  private startRefreshDataInterval(): void {
    if (!this.options.refreshData) {
      return;
    }
    const { interval } = this.options.refreshData;
    if (interval && !this.intervalRefreshData) {
      this.intervalRefreshData = setInterval(() => {
        this.refresh();
      }, interval * this.MINUTE_IN_MS);
    }
  }

  private extractToken(headers: { [head: string]: string }) {
    if (!this.options.loginData) {
      return;
    }
    const { headerToken } = this.options.loginData;
    const head = (headers[headerToken.toLowerCase()] || '').split(' ');
    const token = head[1] || head[0];
    this.storeManager.setToken(token.trim());
  }

  private getAuthHeader() {
    const { headerToken } = this.options.loginData || { headerToken: 'Authorization' };
    const { tokenType, headerTokenReplace } = this.options;

    const token = `${tokenType} ${headerTokenReplace}`.trim();
    return { [headerToken]: token };
  }
}
