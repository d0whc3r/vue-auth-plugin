import { prepareVue } from '../helper/prepare';
import plugin from '../../src';
import MockAdapter from 'axios-mock-adapter';

let localVue;

describe('Plugin', () => {
  const options = {
    tokenType: 'Bearer',
    rolesVar: 'roles',
    authRedirect: '/login',
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
  const sampleUser = {
    login: 'demo',
    [options.rolesVar]: ['ROLE_OTHER', 'ROLE_ADMIN'],
    email: 'demo@demo',
  };
  beforeAll(() => {
    localVue = prepareVue();
    localVue.use(plugin, options);
  });
  it('Redirects before login', async () => {
    localVue.router.push('/');
    expect(localVue.router.history.getCurrentLocation()).toEqual(options.authRedirect);
    localVue.router.push('/admin');
    expect(localVue.router.history.getCurrentLocation()).toEqual(options.authRedirect);
    localVue.router.push('/mix');
    expect(localVue.router.history.getCurrentLocation()).toEqual(options.authRedirect);
    localVue.router.push('/excluded');
    expect(localVue.router.history.getCurrentLocation()).toEqual(options.authRedirect);
  });
  describe('Logged routes', () => {
    const sampleToken = '123456abcdef123456789';
    beforeAll(async () => {
      const mock = new MockAdapter(localVue.axios);
      const loginHeaders = { [options.loginData.headerToken.toLowerCase()]: `${options.tokenType} ${sampleToken}` };
      mock.onPost(`${localVue.axios.defaults.baseURL}${options.loginData.url}`)
        .reply(200, { response: true }, loginHeaders);
      mock.onGet(`${localVue.axios.defaults.baseURL}${options.fetchData.url}`)
        .reply(200, sampleUser);
      await localVue.$auth.login({ username: 'test', password: 'test' });
    });
    it('Enter url with auth true', () => {
      localVue.router.push('/');
      expect(localVue.router.history.getCurrentLocation()).toEqual('/');
    });
    it('Enter url with auth as string', () => {
      localVue.router.push('/admin');
      expect(localVue.router.history.getCurrentLocation()).toEqual('/admin');
    });
    it('Enter url with auth as array', () => {
      localVue.router.push('/mix');
      expect(localVue.router.history.getCurrentLocation()).toEqual('/mix');
    });
    it('Enter url with auth as string and not valid', () => {
      localVue.router.push('/mix');
      localVue.router.push('/excluded');
      expect(localVue.router.history.getCurrentLocation()).toEqual('/mix');
    });
    it('Enter url with auth as array and not valid', () => {
      localVue.router.push('/');
      localVue.router.push('/excludedarr');
      expect(localVue.router.history.getCurrentLocation()).toEqual('/');
    });
  });
});
