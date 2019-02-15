import { VueConstructor } from 'vue';
import { Method, VueAuthOptions } from '@/interfaces/VueAuthOptions';
import AuthVueRouter from '@/lib/auth-vue-router';
import AuthVueVuex from '@/lib/auth-vue-vuex';
import { AuthStoreManager } from '@/lib/auth-vue-store-manager';

export default class Auth {
  private default_options: VueAuthOptions = {
    authMeta: 'auth',
    vuexStoreSpace: 'vue-auth',
    rolesVar: 'roles',
    tokenDefaultName: 'default_auth_token',
    userDefaultName: 'default_auth_user',
    tokenStore: ['vuex', 'localStorage', 'cookie'],

    authRedirect: { path: '/login' },
    forbiddenRedirect: { path: '/403' },
    notFoundRedirect: { path: '/404' },

    registerData: { url: 'auth/register', method: 'POST', redirect: '/login' },
    loginData: { url: 'auth/login', method: 'POST', redirect: '/', fetchUser: true },
    logoutData: { url: 'auth/logout', method: 'POST', redirect: '/', makeRequest: false },
    fetchData: { url: 'auth/user', method: 'GET', enabled: true },
    refreshData: { url: 'auth/refresh', method: 'GET', enabled: true, interval: 30 },

    facebookData: { url: 'auth/facebook', method: 'POST', redirect: '/' },
    googleData: { url: 'auth/google', method: 'POST', redirect: '/' },

    facebookOauth2Data: {
      url: 'https://www.facebook.com/v2.5/dialog/oauth',
      params: {
        client_id: '',
        redirect_uri: window.location.origin + '/login/facebook',
        scope: 'email',
      },
    },
    googleOauth2Data: {
      url: 'https://accounts.google.com/o/oauth2/auth',
      params: {
        client_id: '',
        redirect_uri: window.location.origin + '/login/google',
        scope: 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read',
      },
    },
  };
  private options = {} as VueAuthOptions;

  constructor(private Vue: VueConstructor, options: VueAuthOptions = {} as VueAuthOptions) {
    this.options = { ...this.default_options, ...options };
    if (!this.Vue.router) {
      throw Error('vue-router is a requried dependency');
    }
    let vuex;
    if (this.options.tokenStore.includes('vuex')) {
      if (!this.Vue.store) {
        throw Error('vuex is a requried dependency');
      }
      // this.router = Vue.router as VueRouter;
      vuex = new AuthVueVuex(this.Vue, this.options);
    }
    const storeManager = new AuthStoreManager(this.Vue, this.options);
    new AuthVueRouter(this.Vue, this.options, storeManager);
    this.startRefresh();
    this.configureHttp();
  }

  private startRefresh() {
    const { enabled, interval, method, url } = this.options.refreshData;
    if (enabled && interval) {
      this.refreshToken(url, method);
    }
  }

  private refreshToken(url: string, method: Method) {

  }

  private configureHttp() {

  }
}
