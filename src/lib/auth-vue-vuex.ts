import { VueConstructor } from 'vue';
import { VueAuthOptions } from '@/interfaces/VueAuthOptions';
import { Store } from 'vuex';

export default class AuthVueVuex {
  private store: Store;

  constructor(private Vue: VueConstructor, private options: VueAuthOptions) {
    this.store = Vue.store as Store;
    this.createVueAuthStore();
  }

  private createVueAuthStore() {
    const module = {
      state: {
        token: null,
        user: null,
      },
      mutations: {
        SET_TOKEN(state, token: string) {
          state.token = token;
        },
        SET_USER(state, user) {
          state.user = user;
        },
      },
      actions: {
        setToken({ commit }, token) {
          commit('SET_TOKEN', token);
        },
        setUser({ commit }, user) {
          commit('SET_USER', user);
        },
      },
      getters: {
        token(state) {
          return state.token;
        },
        user(state) {
          return state.user;
        },
        roles(state) {
          return state.user[this.options.rolesVar];
        },
      },
    };

    this.store.registerModule(this.options.vuexStoreSpace, module);
  }

  getStore() {
    return this.store;
  }
}
