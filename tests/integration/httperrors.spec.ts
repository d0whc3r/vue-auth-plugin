import plugin from '../../src/index';
import MockAdapter from 'axios-mock-adapter';
import { LocalVueType, prepareVue } from '../helper/prepare';

let localVue: LocalVueType;
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
  refreshData: {
    url: '/auth/refresh',
    method: 'GET',
    interval: 30,
    enabled: true,
  },
};
let mock: MockAdapter;

describe('Plugin', () => {
  beforeAll(() => {
    localVue = prepareVue();
    localVue.use(plugin, options);
    mock = new MockAdapter(localVue.axios);
  });
  it('Error in login', async () => {
    localVue.router.push('/');
    expect((localVue.router as any).history.getCurrentLocation()).toEqual(options.authRedirect);
    mock.reset();
    mock.onPost(`${localVue.axios.defaults.baseURL}${options.loginData.url}`)
      .reply(500, { response: 'error' });
    try {
      await localVue.$auth.login({ username: 'test', password: 'test' });
      fail('Login http petition must fail');
    } catch (e) {
      expect(e).toBeTruthy();
    }
    localVue.router.push('/');
    expect((localVue.router as any).history.getCurrentLocation()).toEqual(options.authRedirect);
  });
  it('Login with no token in header', async () => {
    mock.reset();
    mock.onPost(`${localVue.axios.defaults.baseURL}${options.loginData.url}`)
      .reply(200, { response: 'ok' }, {});
    await localVue.$auth.login({ username: 'test', password: 'test' });
    expect(localVue.$auth.token()).toBeNull();
  });
  describe('Fetch user and Refresh token error', () => {
    const sampleToken = '123456abcdef123456789';
    beforeAll(async () => {
      mock.reset();
      const loginHeaders = { [options.loginData.headerToken.toLowerCase()]: `${options.tokenType} ${sampleToken}` };
      mock.onPost(`${localVue.axios.defaults.baseURL}${options.loginData.url}`)
        .reply(200,
          { response: true },
          loginHeaders);
      await localVue.$auth.login({ username: 'test', password: 'test' });
    });
    it('Login ok with null user', () => {
      mock.reset();
      mock.onGet(`${localVue.axios.defaults.baseURL}${options.fetchData.url}`)
        .reply(500, { response: 'error' });
      expect(localVue.$auth.token()).toEqual(sampleToken);
      expect(localVue.$auth.user()).toBeNull();
    });
    it('Error in refresh token', async () => {
      const previousToken = localVue.$auth.token();
      mock.reset();
      mock.onGet(`${localVue.axios.defaults.baseURL}${options.refreshData.url}`)
        .reply(500, { response: 'error' });
      try {
        await localVue.$auth.refresh();
        fail('Refresh http petition must fail');
      } catch (e) {
        expect(e).toBeTruthy();
      }
      expect(localVue.$auth.token()).toEqual(previousToken);
    });
    it('Error in fetch user', async () => {
      mock.reset();
      mock.onGet(`${localVue.axios.defaults.baseURL}${options.fetchData.url}`)
        .reply(500, { response: 'error' });
      try {
        await localVue.$auth.fetchUser();
        fail('Fetch user http petition must fail');
      } catch (e) {
        expect(e).toBeTruthy();
      }
      expect(localVue.$auth.token()).toEqual(sampleToken);
      expect(localVue.$auth.user()).toBeNull();
    });
    it('Error in fetch user and logout', async () => {
      localVue.router.push('/');
      expect((localVue.router as any).history.getCurrentLocation()).toEqual('/');
      mock.reset();
      mock.onGet(`${localVue.axios.defaults.baseURL}${options.fetchData.url}`)
        .reply(401, { response: 'error' });
      try {
        await localVue.$auth.fetchUser();
        fail('Fetch user http petition must fail');
      } catch (e) {
        expect(e).toBeTruthy();
      }
      expect(localVue.$auth.token()).toBeNull();
      expect(localVue.$auth.user()).toBeNull();
      localVue.router.push('/');
      expect((localVue.router as any).history.getCurrentLocation()).toEqual(options.authRedirect);
    });
    it('Fetch data with no token', async () => {
      const result = await localVue.$auth.fetchUser();
      expect(result).toBeNull();
    });
  });
});
