import { Store } from 'vuex';
import { AuthUser, VueAuthStore } from '../../interfaces';
import { IVueAuthOptions } from '../auth';

export default class StoreVuex extends VueAuthStore {
  private readonly module: string;

  constructor(Vue: any, options: IVueAuthOptions) {
    super(Vue, options);
    if (!this.Vue.store) {
      throw Error('[vue-auth-plugin] vuex is a required dependency if you want to use "vuex" as storage');
    }
    this.store = this.Vue.store as Store<any>;
    this.module = this.options.vuexStoreSpace;
    this.createVueAuthStore();
    this.initVue();
  }

  public getRoles(): string[] {
    return this.store.getters[`${this.module}/getRoles`];
  }

  public getToken(): string {
    return this.store.getters[`${this.module}/getToken`];
  }

  public getUser(): AuthUser {
    return this.store.getters[`${this.module}/getUser`];
  }

  public setToken(token: string): void {
    this.store.dispatch(`${this.module}/setToken`, token);
  }

  public setUser(user: AuthUser): void {
    this.store.dispatch(`${this.module}/setUser`, user);
  }

  private createVueAuthStore() {
    const { rolesVar } = this.options;
    const module = {
      namespaced: true,
      state: {
        token: this.options.Vue.$data.token,
        user: this.options.Vue.$data.user,
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
        getToken(state): string {
          return state.token;
        },
        getUser(state): AuthUser {
          return state.user;
        },
        getRoles(state): string[] {
          const user = state.user;
          return user && user[rolesVar];
        },
      },
    };

    this.store.registerModule(this.module, module);
  }
}
