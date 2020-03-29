import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import Router from 'vue-router';
import axios, { AxiosInstance } from 'axios';
import VueAxios from 'vue-axios';
import Login from '../../demo/src/Login.vue';
import Info from '../../demo/src/Info.vue';
import Logout from '../../demo/src/Logout.vue';
import Vue from 'vue';
import { VueRouter } from 'vue-router/types/router';
import { AuthVuexState } from '../../src/lib/store/store-vuex';
import Auth from '../../src/lib/auth';

export type LocalVueType = typeof Vue & {
  router: VueRouter;
  store: Store<AuthVuexState>;
  $http: AxiosInstance;
  $auth: Auth;
};

let localVue: LocalVueType;

export function addVuex(localVue: LocalVueType) {
  localVue.use(Vuex);
  localVue.store = new Vuex.Store({});

  return localVue;
}

export function addRouter(localVue: LocalVueType) {
  localVue.use(Router);
  localVue.router = new Router({
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
        component: Info,
      },
      {
        path: '/admin',
        name: 'admin',
        meta: {
          auth: 'ROLE_ADMIN',
        },
        component: Info,
      },
      {
        path: '/mix',
        name: 'mix',
        meta: {
          auth: ['ROLE_ADMIN', 'ROLE_USER'],
        },
        component: Info,
      },
      {
        path: '/excluded',
        name: 'excluded',
        meta: {
          auth: 'ROLE_SUPERADMIN',
        },
        component: Info,
      },
      {
        path: '/excludedarr',
        name: 'excludedarr',
        meta: {
          auth: ['ROLE_SUPERADMIN'],
        },
        component: Info,
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

export function addAxios(localVue: LocalVueType) {
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

export function prepareVue(): LocalVueType {
  localVue = createLocalVue() as LocalVueType;

  addVuex(localVue);
  addRouter(localVue);
  addAxios(localVue);

  return localVue;
}
