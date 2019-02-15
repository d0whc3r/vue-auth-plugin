import { RawLocation, Route, VueRouter } from 'vue-router/types/router';
import { VueAuthOptions } from '@/interfaces/VueAuthOptions';
import AuthStoreManager from '@/lib/auth-vue-store-manager';

export default class AuthVueRouter {
  private router: VueRouter;

  constructor(private Vue: any, private options: VueAuthOptions, private storeManager: AuthStoreManager) {
    if (!this.Vue.router) {
      throw Error('vue-router is a required dependency');
    }
    this.router = Vue.router as VueRouter;
    this.configureRouter();
  }

  public push(to: RawLocation | string) {
    this.router.push(to);
  }

  private configureRouter() {
    this.router.beforeEach((to, from, next) => {
      if (this.haveMeta(to)) {
        const token = this.storeManager.getToken();
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
