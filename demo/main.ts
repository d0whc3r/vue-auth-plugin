import Vue from 'vue';
import VueAxios from 'vue-axios';
import axios from 'axios';
import App from './App.vue';
import Login from './Login.vue';
import User from './User.vue';
import Logout from './Logout.vue';
import plugin from '../src/index';
import Router from 'vue-router';

// --------------------------------------------------------------------
// vue-axios CONFIGURATION
// --------------------------------------------------------------------
const instance = axios.create({
  baseURL: 'http://localhost:6001',
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'Content-type': 'application/json',
  },
});

Vue.use(VueAxios, instance);

// --------------------------------------------------------------------
// vue-router CONFIGURATION
// --------------------------------------------------------------------

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      name: 'user',
      meta: {
        auth: true,
      },
      component: User,
    },
    {
      path: '/logout',
      component: Logout,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});

(Vue as any).router = router;

// --------------------------------------------------------------------
// PLUGIN CONFIGURATION
// --------------------------------------------------------------------
Vue.use(plugin, {
  authMeta: 'auth',
  rolesVar: 'roles',
  tokenDefaultName: 'default_auth_token',
  userDefaultName: 'default_auth_user',
  tokenStore: ['localStorage', 'cookie'],
  headerTokenReplace: '{auth_token}',
  tokenType: 'Bearer',

  authRedirect: '/login',

  loginData: { url: '/api/authenticate', method: 'POST', redirect: '/', headerToken: 'Authorization', fetchUser: true },
  logoutData: { url: '/logout', method: 'POST', redirect: '/' },
  fetchData: { url: '/api/user', method: 'GET', interval: 30, enabled: true },
});

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');

