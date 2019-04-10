import plugin from '../../src/index';
import { prepareVue } from '../helper/prepare';
import MockAdapter from 'axios-mock-adapter';

let localVue;

describe('Functions', () => {
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
      fetchUser: true,
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
  const sampleToken = '123456abcdef123456789';
  const sampleUser = {
    login: 'demo',
    [options.rolesVar]: ['role_1', 'role_2'],
    email: 'demo@demo',
  };
  beforeAll(() => {
    localVue = prepareVue();
    localVue.use(plugin, options);
  });
  describe('Before Login', () => {
    it('Redirect before login', () => {
      localVue.router.push(options.authRedirect);
      expect(localVue.router.history.getCurrentLocation()).toEqual(options.authRedirect);
      localVue.router.push('/');
      expect(localVue.router.history.getCurrentLocation()).toEqual(options.authRedirect);
    });
  });
  describe('Login cases', () => {
    it('Login error', () => {
      const mock = new MockAdapter(localVue.axios);
      mock.onPost(`${localVue.axios.defaults.baseURL}${options.loginData.url}`)
        .reply(401,
          { response: false });

      localVue.$auth.login({ username: 'test', password: 'test' })
        .then(() => {
          fail('Login is wrong');
        })
        .catch((err) => {
          expect(err).toBeDefined();
        });
    });
    it('Login success', () => {
      const mock = new MockAdapter(localVue.axios);
      const loginHeaders = { [options.loginData.headerToken.toLowerCase()]: `${options.tokenType} ${sampleToken}` };
      mock.onPost(`${localVue.axios.defaults.baseURL}${options.loginData.url}`)
        .reply(200, { response: true }, loginHeaders);

      localVue.$auth.login({ username: 'test', password: 'test' })
        .then((response) => {
          expect(response).toBeDefined();
        })
        .catch(() => {
          fail('Login is good');
        });
    });
  });
  describe('Login', () => {
    beforeAll(async () => {
      const mock = new MockAdapter(localVue.axios);
      const loginHeaders = { [options.loginData.headerToken.toLowerCase()]: `${options.tokenType} ${sampleToken}` };
      mock.onPost(`${localVue.axios.defaults.baseURL}${options.loginData.url}`)
        .reply(200, { response: true }, loginHeaders);
      mock.onGet(`${localVue.axios.defaults.baseURL}${options.fetchData.url}`)
        .reply(200, sampleUser);
      localVue.router.push('/login');
      expect(localVue.router.history.getCurrentLocation()).toEqual('/login');
      await localVue.$auth.login({ username: 'test', password: 'test' });
    });
    it('Login result', () => {
      expect(localVue.$auth.check()).toBeTruthy();
      const existingRole = sampleUser[options.rolesVar][0];
      const unExistingRole = existingRole + 'xx';
      expect(localVue.$auth.check(existingRole)).toBeTruthy();
      expect(localVue.$auth.check(unExistingRole)).toBeFalsy();
      expect(localVue.$auth.check([existingRole, unExistingRole])).toBeTruthy();
      expect(localVue.$auth.check([unExistingRole, existingRole])).toBeTruthy();
      expect(localVue.$auth.token()).toEqual(sampleToken);
      expect(localVue.$auth.user()).toEqual(sampleUser);
      expect(localVue.$auth.roles()).toEqual(sampleUser.roles);
      expect(localVue.router.history.getCurrentLocation()).toEqual(options.loginData.redirect);
      localVue.router.push('/');
      expect(localVue.router.history.getCurrentLocation()).toEqual('/');
    });
    it('Info in localStorage', () => {
      expect(localStorage.getItem(options.tokenDefaultName)).toEqual(sampleToken);
      expect(localStorage.getItem(options.userDefaultName)).toEqual(JSON.stringify(sampleUser));
    });
    it('Info in sessionStorage', () => {
      expect(sessionStorage.getItem(options.tokenDefaultName)).toEqual(sampleToken);
      expect(sessionStorage.getItem(options.userDefaultName)).toEqual(JSON.stringify(sampleUser));
    });
    it('Info in cookies', () => {
      const matchToken = document.cookie.match(new RegExp(`(^| )${options.tokenDefaultName}=([^;]+)`));
      expect(matchToken[2]).toEqual(`"${sampleToken}"`);
      const matchUser = document.cookie.match(new RegExp(`(^| )${options.userDefaultName}=([^;]+)`));
      expect(matchUser[2]).toEqual(JSON.stringify(sampleUser));
    });
    it('Info in vuex', () => {
      expect(localVue.store.getters[`${options.vuexStoreSpace}/getToken`]).toEqual(sampleToken);
      expect(localVue.store.getters[`${options.vuexStoreSpace}/getUser`]).toEqual(sampleUser);
    });
    it('Fetch User', async () => {
      await localVue.$auth.fetchUser();
      expect(localVue.$auth.user()).toEqual(sampleUser);
    });
    describe('Logout', () => {
      beforeAll(() => {
        const mock = new MockAdapter(localVue.axios);
        mock.onPost(`${localVue.axios.defaults.baseURL}${options.logoutData.url}`)
          .reply(200, { response: true });
      });
      it('Logout result', async () => {
        await localVue.$auth.logout();
        expect(localVue.router.history.getCurrentLocation()).toEqual('/login');
        expect(localVue.$auth.check()).toBeFalsy();
        expect(localVue.$auth.check(sampleUser[options.rolesVar][0])).toBeFalsy();
        expect(localVue.$auth.token()).toBeNull();
        expect(localVue.$auth.user()).toBeNull();
      });
      it('Info in localStorage', () => {
        expect(localStorage.getItem(options.tokenDefaultName)).toBeNull();
        expect(localStorage.getItem(options.userDefaultName)).toBeNull();
      });
      it('Info in sessionStorage', () => {
        expect(sessionStorage.getItem(options.tokenDefaultName)).toBeNull();
        expect(sessionStorage.getItem(options.userDefaultName)).toBeNull();
      });
      it('Info in cookies', () => {
        const matchToken = document.cookie.match(new RegExp(`(^| )${options.tokenDefaultName}=([^;]+)`));
        expect(matchToken).toBeNull();
        const matchUser = document.cookie.match(new RegExp(`(^| )${options.userDefaultName}=([^;]+)`));
        expect(matchUser).toBeNull();
      });
      it('Info in vuex', () => {
        expect(localVue.store.getters[`${options.vuexStoreSpace}/getToken`]).toBeNull();
        expect(localVue.store.getters[`${options.vuexStoreSpace}/getUser`]).toBeNull();
      });
    });
  });
});
