import { LocalVueType, prepareVue } from '../helper/prepare';
import MockAdapter from 'axios-mock-adapter';
import { AxiosResponse } from 'axios';
import plugin, { VueAuthOptions } from '../../src';

describe('With customToken', () => {
  let localVue: LocalVueType;
  const options: VueAuthOptions = {
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
      fetchUser: true,
    },
    fetchItem: '',
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
      enabled: false,
    },
  };
  const sampleToken = '123456abcdef123456789';
  let mock: MockAdapter;
  beforeAll(() => {
    localVue = prepareVue();
    const customOptions = {
      ...options,
      loginData: { ...options.loginData, customToken: (response: AxiosResponse) => response.data.loginToken },
    };
    localVue.use(plugin, customOptions);
    mock = new MockAdapter(localVue.axios);
  });
  it('Login success using customToken', async () => {
    mock.reset();
    const loginInfo = { loginToken: sampleToken };
    mock.onPost(`${localVue.axios.defaults.baseURL}${options.loginData!.url}`)
      .reply(200, loginInfo, {});

    try {
      const response = await localVue.$auth.login({ username: 'test', password: 'test' });
      expect(response).toBeTruthy();
      expect(localVue.$auth.token()).toEqual(sampleToken);
    } catch (_) {
      fail('Login is good');
    }
  });
});
