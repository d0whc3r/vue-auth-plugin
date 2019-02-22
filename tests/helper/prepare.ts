import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Router from 'vue-router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Login from '../../demo/Login.vue';
import User from '../../demo/User.vue';
import Logout from '../../demo/Logout.vue';

const localVue = createLocalVue();

export function addVuex(localVue) {
  localVue.use(Vuex);
  (localVue as any).store = new Vuex.Store({});

  return localVue;
}

export function addRouter(localVue) {
  localVue.use(Router);
  (localVue as any).router = new Router({
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

  return localVue;
}

export function addAxios(localVue) {
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

export function prepareVue() {
  addVuex(localVue);
  addRouter(localVue);
  addAxios(localVue);

  return localVue;
}
