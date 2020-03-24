import { RawLocation, Route, RouteRecord, VueRouter } from 'vue-router/types/router';
import AuthStoreManager from './auth-vue-store-manager';
import { IVueAuthOptions } from './auth';

export default class AuthVueRouter {
  private readonly router: VueRouter;

  constructor(
    private readonly Vue: any,
    private readonly options: IVueAuthOptions,
    private readonly storeManager: AuthStoreManager) {
    if (!this.Vue.router) {
      throw Error('[vue-auth-plugin] vue-router is a required dependency');
    }
    this.router = Vue.router as VueRouter;
    this.configureRouter();
  }

  public push(to: RawLocation | string) {
    this.router.push(to);
  }

  public afterLogin(redirect: RawLocation | string | undefined) {
    let promise!: Promise<Route>;
    if (redirect) {
      promise = this.router.push(redirect);
    } else if (this.router.currentRoute.query.nextUrl) {
      const nextUrl = this.router.currentRoute.query.nextUrl;
      if (typeof nextUrl === 'string') {
        promise = this.router.push(nextUrl);
      }
    } else {
      promise = this.router.push('/');
    }
    promise.catch(() => {
      const result = redirect || '/';
      this.router.push(result);
    });
  }

  private configureRouter() {
    this.router.beforeEach((to, from, next) => {
      const { authRedirect, loginData } = this.options;
      const routes = this.metaRoutes(to);
      if (routes && routes.length) {
        if (this.isAuthorized(routes)) {
          next();
        } else {
          const redirectPath: RawLocation = { path: authRedirect || '/' };
          if (loginData && !loginData.redirect) {
            redirectPath.query = { nextUrl: to.fullPath };
          }
          const nextPath = from.fullPath !== to.fullPath && this.storeManager.check() ? from.fullPath : redirectPath;
          next(nextPath);
        }
      } else {
        next();
      }
    });
  }

  private isAuthorized(routes: RouteRecord[]) {
    const token = this.storeManager.getToken();
    let isAuth = false;
    routes.forEach((route) => {
      const auth = this.options.authMeta && route.meta[this.options.authMeta];
      if (typeof auth === 'boolean') {
        isAuth = !!token;
      } else if (typeof auth === 'string' || Array.isArray(auth)) {
        isAuth = this.storeManager.check(auth);
      }
    });
    return isAuth;
  }

  private metaRoutes(to: Route): RouteRecord[] {
    return to.matched
      .filter((url) => url.path !== this.options.authRedirect)
      .filter((match) => this.options.authMeta && match.meta.hasOwnProperty(this.options.authMeta))
      .filter((meta) => !!meta);
  }
}
