import { VueAuthOptions } from '@/interfaces/VueAuthOptions';
import AuthStoreManager from '@/lib/auth-vue-store-manager';
import { AxiosInstance } from 'axios';
import AuthVueRouter from '@/lib/auth-vue-router';

export default class AuthVueHttp {
  private http: AxiosInstance;
  private interval: number;

  constructor(
    private Vue: any,
    private options: VueAuthOptions,
    private storeManager: AuthStoreManager,
    private router: AuthVueRouter) {
    if (!this.Vue.axios) {
      throw Error('vue-axios is a required dependency');
    }
    this.http = Vue.axios as AxiosInstance;
    this.configureHttp();
    this.startRefresh();
  }

  private configureHttp() {
    this.http.interceptors.request.use((request) => {
      Object.keys(request.headers)
        .forEach((head) => {
          const value: string = request.headers[head];
          if (value.includes(this.options.headerTokenReplace)) {
            request.headers[head] = value.replace(this.options.headerTokenReplace, this.storeManager.getToken());
          }
        });
      return request;
    }, (error) => {
      return Promise.reject(error);
    });
    this.http.interceptors.response.use((response) => {
      return response;
    }, (error) => {
      const status = error && error.response && error.response.status;
      if (status === 401) {
        this.storeManager.resetAll();
        this.logout();
      }
    });
  }

  private logout() {
    const { url, method, redirect, makeRequest } = this.options.logoutData;
    if (makeRequest) {
      this.http({
        method,
        url,
      });
    }
    if (redirect) {
      this.router.push(redirect);
    }
  }

  private startRefresh() {
    const { enabled, interval, method, url } = this.options.fetchData;
    if (enabled) {
      this.http({
        method,
        url,
      }).then(({ data }) => {
        this.storeManager.setUser(data);
      }).catch((error) => error);
    }
    if (!this.interval) {
      this.interval = setInterval(() => {
        this.startRefresh();
      }, interval * 60 * 1000);
    }
  }
}
