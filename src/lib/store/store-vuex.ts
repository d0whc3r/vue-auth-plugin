import { ActionContext, Store } from 'vuex';
import { AuthUser, VueAuthStore } from '../../interfaces';
import { IVueAuthOptions } from '../auth';

export type AuthVuexState = {
  token?: string;
  user?: AuthUser;
};

export default class StoreVuex extends VueAuthStore {
  private readonly module?: string;

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

  public setToken(token: string | null): void {
    this.store.dispatch(`${this.module}/setToken`, token);
  }

  public setUser(user: AuthUser | null): void {
    this.store.dispatch(`${this.module}/setUser`, user);
  }

  private createVueAuthStore() {
    const { rolesVar } = this.options;
    const module = {
      namespaced: true,
      state: {
        token: this.options.Vue.$data.token,
        user: this.options.Vue.$data.user,
      } as AuthVuexState,
      mutations: {
        SET_TOKEN(state: AuthVuexState, token: string) {
          state.token = token;
        },
        SET_USER(state: AuthVuexState, user: AuthUser) {
          state.user = user;
        },
      },
      actions: {
        setToken(actionContext: ActionContext<AuthVuexState, any>, token: string) {
          actionContext.commit('SET_TOKEN', token);
        },
        setUser(actionContext: ActionContext<AuthVuexState, any>, user: AuthUser) {
          actionContext.commit('SET_USER', user);
        },
      },
      getters: {
        getToken(state: AuthVuexState): string | undefined {
          return state.token;
        },
        getUser(state: AuthVuexState): AuthUser | undefined {
          return state.user;
        },
        getRoles(state: AuthVuexState): string[] {
          const user = state.user;
          return user && rolesVar && user[rolesVar];
        },
      },
    };

    this.store.registerModule(this.module, module);
    // Listen for mutation from outside, e.g. with vuex-shared-mutations
    this.store.subscribe((mutation: any, state: any) => {
      if (mutation.type === `${this.module}/SET_TOKEN`
        && mutation.payload !== this.options.Vue.$data.token) {
        this.options.Vue.$data.token = mutation.payload;
      } else if (mutation.type === `${this.module}/SET_USER`
        && mutation.payload !== this.options.Vue.$data.user) {
        this.options.Vue.$data.user = mutation.payload;
      }
    });
  }
}
