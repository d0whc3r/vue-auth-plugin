import plugin from '../../src/index';
import MockAdapter from 'axios-mock-adapter';
import { prepareVue } from '../helper/prepare';

let localVue;

describe('Plugin', () => {
  const options = {
    tokenDefaultName: 'auth_token',
    userDefaultName: 'auth_user',
    tokenType: 'Bearer',
    rolesVar: 'roles',
    vuexStoreSpace: 'vue-auth',
    tokenStore: ['vuex', 'localStorage', 'sessionStorage', 'cookie'],
    headerTokenReplace: '{auth_token}',
    authRedirect: '/login',
    loginData: {
      url: '/auth/login',
      method: 'POST',
      redirect: '/',
      headerToken: 'Authorization',
      fetchUser: false,
    },
    fetchData: {
      url: '/auth/user',
      method: 'GET',
      interval: 30,
      enabled: false,
    },
    logoutData: {
      url: '/auth/logout',
      method: 'POST',
      redirect: '/login',
      makeRequest: true,
    },
  };
  beforeAll(() => {
    localVue = prepareVue();
    localVue.use(plugin, options);
  });
  it('Error in login', async () => {
    localVue.router.push('/');
    expect(localVue.router.history.getCurrentLocation()).toEqual('/login');
    const mock = new MockAdapter(localVue.axios);
    mock.onPost(`${localVue.axios.defaults.baseURL}${options.loginData.url}`)
      .reply(500, { response: 'error' });
    try {
      await localVue.$auth.login({ username: 'test', password: 'test' });
      expect(false).toBeTruthy();
    } catch (e) {
      expect(e).toBeDefined();
    }
    localVue.router.push('/');
    expect(localVue.router.history.getCurrentLocation()).toEqual('/login');
  });
  describe('Fetch user error', () => {
    const sampleToken = '123456abcdef123456789';
    beforeAll(async () => {
      const mock = new MockAdapter(localVue.axios);
      const loginHeaders = { [options.loginData.headerToken.toLowerCase()]: `${options.tokenType} ${sampleToken}` };
      mock.onPost(`${localVue.axios.defaults.baseURL}${options.loginData.url}`)
        .reply(200,
          { response: true },
          loginHeaders);
      await localVue.$auth.login({ username: 'test', password: 'test' });
    });
    it('Login ok with null user', () => {
      const mock = new MockAdapter(localVue.axios);
      mock.onGet(`${localVue.axios.defaults.baseURL}${options.fetchData.url}`)
        .reply(500, { response: 'error' });
      expect(localVue.$auth.token()).toEqual(sampleToken);
      expect(localVue.$auth.user()).toBeNull();
    });
    it('Error in fetch user', async () => {
      const mock = new MockAdapter(localVue.axios);
      mock.onGet(`${localVue.axios.defaults.baseURL}${options.fetchData.url}`)
        .reply(500, { response: 'error' });
      try {
        localVue.$auth.fetchUser();
        expect(false).toBeTruthy();
      } catch (e) {
        expect(e).toBeDefined();
      }
      expect(localVue.$auth.token()).toEqual(sampleToken);
      expect(localVue.$auth.user()).toBeNull();
    });
    it('Error in fetch user and logout', async () => {
      localVue.router.push('/');
      expect(localVue.router.history.getCurrentLocation()).toEqual('/');
      const mock = new MockAdapter(localVue.axios);
      mock.onGet(`${localVue.axios.defaults.baseURL}${options.fetchData.url}`)
        .reply(401, { response: 'error' });
      try {
        await localVue.$auth.fetchUser();
        expect(false).toBeTruthy();
      } catch (e) {
        expect(e).toBeDefined();
      }
      expect(localVue.$auth.token()).toBeNull();
      expect(localVue.$auth.user()).toBeNull();
      localVue.router.push('/');
      expect(localVue.router.history.getCurrentLocation()).toEqual('/login');
    });
  });
});
