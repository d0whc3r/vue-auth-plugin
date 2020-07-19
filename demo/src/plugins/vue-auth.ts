import Vue from 'vue';
import VueAuth from '../../../src/index';

// --------------------------------------------------------------------
// PLUGIN CONFIGURATION
// --------------------------------------------------------------------
Vue.use(VueAuth, {
  authMeta: 'auth',
  rolesVar: 'roles',
  tokenDefaultName: 'default_auth_token',
  userDefaultName: 'default_auth_user',
  tokenStore: ['cookie', 'localStorage', 'vuex'],
  headerTokenReplace: '{auth_token}',
  tokenType: 'Bearer',
  vuexStoreSpace: 'vue-auth',

  authRedirect: '/login',

  loginData: {
    url: '/api/authenticate',
    method: 'POST',
    redirect: undefined,
    headerToken: 'Authorization',
    fetchUser: true,
    fetchData: (response) => response.data.userInfo,
  },
  logoutData: { redirect: '/login' },
  fetchData: { url: '/api/user', method: 'GET', interval: 30, enabled: true },
  refreshData: { url: '/api/refresh', method: 'GET', interval: 30, enabled: true },
});
