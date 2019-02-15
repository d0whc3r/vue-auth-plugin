import { Route, VueRouter } from 'vue-router/types/router';
import { VueConstructor } from 'vue';
import { Store } from 'vuex';
import { VueAuthOptions } from '@/interfaces/VueAuthOptions';

export default class AuthVueRouter {
  private router: VueRouter;

  constructor(private Vue: VueConstructor, private options: VueAuthOptions) {
    this.router = Vue.router as VueRouter;
    this.configureRouter();
  }

  private configureRouter() {
    this.router.beforeEach((to, from, next) => {
      if (this.haveMeta(to)) {
        const token = this.store.getters[`${this.options.vuexStoreSpace}/getToken`];
        if (token) {
          next();
        } else {
          next(this.options.authRedirect.path);
        }
      } else {
        next();
      }
    });
  }

  private haveMeta(to: Route) {
    return !!to.matched
      .filter((url) => url.path !== this.options.authRedirect.path)
      .filter((match) => match.meta.hasOwnProperty(this.options.authMeta))
      .filter((meta) => !!meta)
      .length;
  }
}
