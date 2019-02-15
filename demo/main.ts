import Vue, { VueConstructor } from 'vue';
import App from './Demo.vue';
import plugin from '../src/index';

Vue.use<VueConstructor>(plugin, { added: 100 });

Vue.config.productionTip = false;

new Vue({
  // NOTE: if you need to inject as option, you can set here!
  // plugin,
  render: h => h(App),
}).$mount('#app');
