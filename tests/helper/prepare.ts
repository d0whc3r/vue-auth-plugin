import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Router from 'vue-router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Login from '../../demo/Login.vue';
import User from '../../demo/User.vue';
import Logout from '../../demo/Logout.vue';

export function prepareVue() {
  const localVue = createLocalVue();

  localVue.use(Vuex);
  const store = new Vuex.Store({});
  (localVue as any).store = store;

  localVue.use(Router);
  const router = new Router({
    mode: 'history',
    base: '/',
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
  (localVue as any).router = router;

  const instance = axios.create({
    baseURL: 'http://localhost:6001',
    timeout: 15000,
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    },
  });

  localVue.use(VueAxios, instance);

  return localVue;
}
