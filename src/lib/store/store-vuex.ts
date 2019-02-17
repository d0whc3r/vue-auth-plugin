import { Store } from 'vuex';
import { AuthUser, VueAuthOptions, VueAuthStore } from '../../interfaces';

export default class StoreVuex implements VueAuthStore {
  private readonly store: Store<any>;
  private readonly module: string;

  constructor(private Vue: any, private options: VueAuthOptions) {
    if (!this.Vue.store) {
      throw Error('vuex is a required dependency if you want to use "vuex" as storage');
    }
    this.store = this.Vue.store as Store<any>;
    this.module = this.options.vuexStoreSpace;
    this.createVueAuthStore();
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
        getToken(state): string {
          return state.token;
        },
        getUser(state): AuthUser {
          return state.user;
        },
        getRoles(state): string[] {
          return (state.user || {})[rolesVar];
        },
      },
    };

    this.store.registerModule(this.module, module);
  }
}
