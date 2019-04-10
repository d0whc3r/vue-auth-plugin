import { VueAuthLogin, VueAuthOptions } from '../interfaces';
import AuthVueRouter from './auth-vue-router';
import AuthStoreManager from './auth-vue-store-manager';
import AuthVueHttp from './auth-vue-http';
import { Vue } from 'vue/types/vue';

export interface IVueAuthOptions extends VueAuthOptions {
  Vue: Vue;
}

export default class Auth {
  private readonly DEFAULT_OPTIONS: VueAuthOptions = {
    authMeta: 'auth',
    rolesVar: 'roles',
    tokenDefaultName: 'default_auth_token',
    userDefaultName: 'default_auth_user',
    tokenStore: ['vuex', 'localStorage', 'cookie'],
    headerTokenReplace: '{auth_token}',
    tokenType: 'Bearer',
    vuexStoreSpace: 'vue-auth',

    authRedirect: '/login',

    loginData: {
      url: '/auth/login',
      method: 'POST',
      redirect: '/',
      headerToken: 'Authorization',
      fetchUser: false,
    },
    logoutData: {
      url: '/auth/logout',
      method: 'POST',
      redirect: '/login',
      makeRequest: false,
    },
    fetchItem: '',
    fetchData: {
      url: '/auth/user',
      method: 'GET',
      interval: 30,
      enabled: false,
    },
  };
  private readonly options = {} as IVueAuthOptions;
  private readonly http: AuthVueHttp;
  private readonly storeManager: AuthStoreManager;

  constructor(private readonly Vue: any, options: VueAuthOptions = {} as VueAuthOptions) {
    this.options = {
      ...this.DEFAULT_OPTIONS,
      ...options,
      Vue: new this.Vue({
        data() {
          return {
            user: null,
            token: null,
          };
        },
      }),
    };
    this.storeManager = new AuthStoreManager(this.Vue, this.options);
    const router = new AuthVueRouter(this.Vue, this.options, this.storeManager);
    this.http = new AuthVueHttp(this.Vue, this.options, this.storeManager, router);
  }

  public login(loginInfo: VueAuthLogin) {
    return this.http.login(loginInfo);
  }

  public logout() {
    return this.http.logout();
  }

  public check(role?: string | string[]): boolean {
    return this.storeManager.check(role);
  }

  public user() {
    return this.storeManager.getUser();
  }

  public roles() {
    return this.storeManager.getRoles();
  }

  public token() {
    return this.storeManager.getToken();
  }

  public fetchUser() {
    return this.http.fetchData(true);
  }

}
