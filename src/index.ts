import { PluginObject, VueConstructor } from 'vue';
import { VueAuthOptions } from './interfaces/VueAuthOptions';
import Auth from './lib/auth';

declare global {
  interface Window {
    Vue: VueConstructor;
  }
}

const version = '__VERSION__';

const install = (Vue: VueConstructor, options: VueAuthOptions = {} as VueAuthOptions): void => {

  Vue.prototype.$auth = new Auth(Vue, options);
};

const plugin: PluginObject<VueAuthOptions> = {
  install,
  version,
};
export default plugin;
export * from './interfaces/VueAuthOptions';

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin, {});
}
