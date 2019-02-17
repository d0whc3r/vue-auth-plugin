import VueAuth from '../src/lib/auth';
import plugin from '../src';

declare module 'vue/types/vue' {

  interface Vue {
    readonly $auth: VueAuth;
  }
}

export * from '../src/interfaces';
export default plugin;
