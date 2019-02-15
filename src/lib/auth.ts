import { VueConstructor } from 'vue';
import { Method, VueAuthOptions } from '@/interfaces/VueAuthOptions';
import AuthVueRouter from '@/lib/auth-vue-router';
import AuthStoreManager from '@/lib/auth-vue-store-manager';
import AuthVueHttp from '@/lib/auth-vue-http';

export default class Auth {
  private default_options: VueAuthOptions = {
    authMeta: 'auth',
    rolesVar: 'roles',
    tokenDefaultName: 'default_auth_token',
    userDefaultName: 'default_auth_user',
    tokenStore: ['vuex', 'localStorage', 'cookie'],
    vuexStoreSpace: 'vue-auth',
    headerTokenReplace: '{auth_token}',

    authRedirect: { path: '/login' },

    registerData: { url: 'auth/register', method: 'POST', redirect: '/login' },
    loginData: { url: 'auth/login', method: 'POST', redirect: '/', fetchUser: true },
    logoutData: { url: 'auth/logout', method: 'POST', redirect: '/', makeRequest: false },
    fetchData: { url: 'auth/user', method: 'GET', interval: 30, enabled: true },

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
  private options: VueAuthOptions = {};

  constructor(private Vue: any, options: VueAuthOptions = {} as VueAuthOptions) {
    this.options = { ...this.default_options, ...options };
    const storeManager = new AuthStoreManager(this.Vue, this.options);
    const router = new AuthVueRouter(this.Vue, this.options, storeManager);
    const http = new AuthVueHttp(this.Vue, this.options, storeManager, router);
  }

}
