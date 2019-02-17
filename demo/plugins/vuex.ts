import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: false,
  plugins: [createPersistedState()],
});

(Vue as any).store = store;

export default store;
