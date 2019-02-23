import { PluginObject, VueConstructor } from 'vue';
import { VueAuthOptions } from './interfaces';
import Auth from './lib/auth';

declare global {
  interface Window {
    Vue: VueConstructor;
  }
}

const version = '__VERSION__';

const install = (Vue: any, options: VueAuthOptions = {} as VueAuthOptions): void => {

  if (plugin.installed) {
    return;
  }
  plugin.installed = true;

  const auth = new Auth(Vue, options);

  Vue.$auth = auth;

  Object.defineProperties(Vue.prototype, {
    $auth: {
      get() {
        return auth;
      },
    },
  });

};

const plugin: PluginObject<VueAuthOptions> = {
  install,
  version,
};
export default plugin;
export * from './interfaces';

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin, {});
}
