import { VueAuthOptions } from '@/interfaces/VueAuthOptions';
import AuthStoreManager from '@/lib/auth-vue-store-manager';
import { AxiosInstance } from 'axios';
import AuthVueRouter from '@/lib/auth-vue-router';
import { VueAuthLogin } from '@/interfaces/VueAuthLogin';

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

  logout() {
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

  fetchData(force: boolean = false) {
    const { enabled, method, url } = this.options.fetchData;
    if (enabled || force) {
      const promise = this.http({
        method,
        url,
      });
      promise
        .then(({ data }) => {
          this.storeManager.setUser(data);
        })
        .catch((error) => error);
      return promise;
    }
  }

  login(loginInfo: VueAuthLogin) {
    const { method, url, redirect, fetchUser } = this.options.loginData;
    const promise = this.http({
      method,
      url,
      data: loginInfo,
    });
    promise
      .then(({ headers }) => {
        this.extractToken(headers);
        this.startRefresh();
        if (fetchUser) {
          this.fetchData(true);
        }
        if (redirect) {
          this.router.push(redirect);
        }
      })
      .catch((error) => error);
    return promise;
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
    const head = headers[headerToken].split(' ');
    const token = head[1] || head[0];
    this.storeManager.setToken(token.trim());
  }
}
