import { createLocalVue } from '@vue/test-utils';
import plugin from '../../src/index';
import { addAxios, addRouter, addVuex, LocalVueType, prepareVue } from '../helper/prepare';

let localVue: LocalVueType;

describe('Requirements', () => {
  const options = {
    tokenStore: ['vuex', 'localStorage', 'cookie'],
  };
  beforeEach(() => {
    localVue = createLocalVue() as LocalVueType;
  });
  it('Do not include router', () => {
    localVue = addAxios(localVue);
    localVue = addVuex(localVue);
    try {
      localVue.use(plugin, options);
      fail('Vue-router is missing');
    } catch (e) {
      expect(e.message).toBe('[vue-auth-plugin] vue-router is a required dependency');
    }
  });
  it('Do not include axios', () => {
    localVue = addRouter(localVue);
    localVue = addVuex(localVue);
    try {
      localVue.use(plugin, options);
      fail('Vue-axios is missing');
    } catch (e) {
      expect(e.message).toBe('[vue-auth-plugin] vue-axios is a required dependency');
    }
  });
  it('Do not include vuex', () => {
    localVue = addRouter(localVue);
    localVue = addAxios(localVue);
    try {
      localVue.use(plugin, options);
      fail('Vuex is missing');
    } catch (e) {
      expect(e.message).toBe('[vue-auth-plugin] vuex is a required dependency if you want to use "vuex" as storage');
    }
  });
  it('Do not include vuex and not use in storage', () => {
    localVue = addRouter(localVue);
    localVue = addAxios(localVue);
    try {
      localVue.use(plugin, { ...options, tokenStore: ['localStorage', 'cookie'] });
      expect(localVue.$auth).toBeTruthy();
    } catch (e) {
      fail('Vuex is not used');
    }
  });
  it('Do not define loginData', async () => {
    localVue = prepareVue();
    localVue.use(plugin, { ...options, loginData: null });
    try {
      await localVue.$auth.login({ username: 'test', password: 'test' });
      fail('loginData is missing in config options');
    } catch (e) {
      expect(e).toBeFalsy();
    }
  });
});
