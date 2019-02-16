import VueAuth from '../src/lib/auth';

declare module 'vue/types/vue' {

  interface Vue {
    $auth: VueAuth;
  }
}

export * from '../src/interfaces';
export {  VueAuth };
