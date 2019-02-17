import { VueAuthLogin, VueAuthOptions } from '../interfaces';
import AuthVueRouter from './auth-vue-router';
import AuthStoreManager from './auth-vue-store-manager';
import AuthVueHttp from './auth-vue-http';

export default class Auth {
  private default_options: VueAuthOptions = {
    authMeta: 'auth',
    rolesVar: 'roles',
    tokenDefaultName: 'default_auth_token',
    userDefaultName: 'default_auth_user',
    tokenStore: ['vuex', 'localStorage', 'cookie'],
    headerTokenReplace: '{auth_token}',
    tokenType: 'Bearer',
    vuexStoreSpace: 'vue-auth',

    authRedirect: '/login',

    loginData: { url: '/auth/login', method: 'POST', redirect: '/', headerToken: 'Authorization', fetchUser: true },
    logoutData: { url: '/auth/logout', method: 'POST', redirect: '/', makeRequest: false },
    fetchData: { url: '/auth/user', method: 'GET', interval: 30, enabled: true },
  };
  private options = {} as VueAuthOptions;
  private http: AuthVueHttp;
  private storeManager: AuthStoreManager;

  constructor(private Vue: any, options: VueAuthOptions = {} as VueAuthOptions) {
    this.options = { ...this.default_options, ...options };
    this.storeManager = new AuthStoreManager(this.Vue, this.options);
    const router = new AuthVueRouter(this.Vue, this.options, this.storeManager);
    this.http = new AuthVueHttp(this.Vue, this.options, this.storeManager, router);
  }

  login(loginInfo: VueAuthLogin) {
    return this.http.login(loginInfo);
  }

  logout() {
    return this.http.logout();
  }

  check(role?: string | string[]): boolean {
    return this.storeManager.checkRole(role);
  }

  user() {
    return this.storeManager.getUser();
  }

  token() {
    return this.storeManager.getToken();
  }

  fetchUser() {
    return this.http.fetchData(true);
  }

}
