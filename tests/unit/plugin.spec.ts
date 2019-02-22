import plugin from '../../src/index';
import { prepareVue } from '../helper/prepare';
import MockAdapter from 'axios-mock-adapter';

let localVue;

describe('Plugin', () => {
  beforeEach(() => {
    localVue = prepareVue();
  });
  it('minimum dependencies', () => {
    localVue.use(plugin, {});
    expect(localVue.store).toBeDefined();
    expect(localVue.router).toBeDefined();
    expect(localVue.axios).toBeDefined();
    expect(localVue.$auth).toBeDefined();
  });
  describe('Login', () => {
    const options = {
      tokenDefaultName: 'auth_token',
      userDefaultName: 'auth_user',
      tokenType: 'Bearer',
      rolesVar: 'roles',
      loginData: {
        url: '/auth/login',
        method: 'POST',
        redirect: '/',
        headerToken: 'Authorization',
        fetchUser: true,
      },
      fetchData: {
        url: '/auth/user',
        method: 'GET',
        interval: 30,
        enabled: false,
      },
    };
    const sampleToken = '123456abcdef123456789';
    const sampleUser = {
      login: 'demo',
      roles: ['role_1', 'role_2'],
      email: 'demo@demo',
    };
    beforeEach(async () => {
      localVue.use(plugin, options);
      const mock = new MockAdapter(localVue.axios);
      const loginHeaders = { [options.loginData.headerToken.toLowerCase()]: `${options.tokenType} ${sampleToken}` };
      mock.onPost(`${localVue.axios.defaults.baseURL}${options.loginData.url}`)
        .reply(200,
          { response: true },
          loginHeaders);
      mock.onGet(`${localVue.axios.defaults.baseURL}${options.fetchData.url}`)
        .reply(200, sampleUser);
      await localVue.$auth.login({ username: 'test', password: 'test' });
    });
    it('Login result', () => {
      expect(localVue.$auth.check()).toBeTruthy();
      expect(localVue.$auth.token()).toEqual(sampleToken);
      expect(localVue.$auth.user()).toEqual(sampleUser);
    });
  });
});
