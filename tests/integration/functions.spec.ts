import plugin, { VueAuthOptions } from '../../src/index';
import { LocalVueType, prepareVue } from '../helper/prepare';
import MockAdapter from 'axios-mock-adapter';

describe('Functions', () => {
  let localVue: LocalVueType;
  const DEFAULT_OPTIONS: VueAuthOptions = {
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
  const sampleToken2 = '987654abbbbccc1321';
  const sampleUser = {
    login: 'demo',
    [DEFAULT_OPTIONS.rolesVar!]: ['role_1', 'role_2'],
    email: 'demo@demo',
  };
  let mock: MockAdapter;
  let options: VueAuthOptions;

  function reset(opts?: VueAuthOptions) {
    localVue = prepareVue();
    options = { ...DEFAULT_OPTIONS, ...opts };
    localVue.use(plugin, options);
    mock && mock.reset();
  }

  beforeAll(() => {
    reset();
    mock = new MockAdapter(localVue.axios);
  });
  describe('Before Login', () => {
    it('Redirect before login', () => {
      localVue.router.push(options.authRedirect!);
      expect((localVue.router as any).history.getCurrentLocation()).toEqual(options.authRedirect);
      localVue.router.push('/');
      expect((localVue.router as any).history.getCurrentLocation()).toEqual(options.authRedirect);
    });
  });
  describe('Login cases', () => {
    it('Login error', async () => {
      mock.onPost(`${localVue.axios.defaults.baseURL}${options.loginData!.url}`)
        .reply(401,
          { response: false });

      try {
        await localVue.$auth.login({ username: 'test', password: 'test' });
        fail('Login is wrong');
      } catch (err) {
        expect(err).toBeTruthy();
      }
    });
    it('Login success using token header', async () => {
      mock.reset();
      const loginHeaders = { [options.loginData!.headerToken!.toLowerCase()]: `${options.tokenType} ${sampleToken}` };
      mock.onPost(`${localVue.axios.defaults.baseURL}${options.loginData!.url}`)
        .reply(200, { response: true }, loginHeaders);

      try {
        const response = await localVue.$auth.login({ username: 'test', password: 'test' });
        expect(response).toBeTruthy();
      } catch (_) {
        fail('Login is good');
      }
    });
  });
  describe('Login', () => {
    beforeAll(async () => {
      const loginHeaders = { [options.loginData!.headerToken!.toLowerCase()]: `${options.tokenType} ${sampleToken}` };
      const refreshHeaders = { [options.loginData!.headerToken!.toLowerCase()]: `${options.tokenType} ${sampleToken2}` };
      mock.onPost(`${localVue.axios.defaults.baseURL}${options.loginData!.url}`)
        .reply(200, { response: true }, loginHeaders);
      mock.onGet(`${localVue.axios.defaults.baseURL}${options.fetchData!.url}`)
        .reply(200, sampleUser);
      mock.onGet(`${localVue.axios.defaults.baseURL}${options.refreshData!.url}`)
        .reply(200, { response: true }, refreshHeaders);
      const currentLocation = (localVue.router as any).history.getCurrentLocation();
      if (!currentLocation.includes('login')) {
        await localVue.router.push('/login');
      }
      expect(currentLocation).toEqual('/login');
      await localVue.$auth.login({ username: 'test', password: 'test' });
    });
    it('Login result', async () => {
      expect(localVue.$auth.check()).toBeTruthy();
      const existingRole = sampleUser[options.rolesVar!][0];
      const unExistingRole = existingRole + 'xx';
      expect(localVue.$auth.check(existingRole)).toBeTruthy();
      expect(localVue.$auth.check(unExistingRole)).toBeFalsy();
      expect(localVue.$auth.check([existingRole, unExistingRole])).toBeTruthy();
      expect(localVue.$auth.check([unExistingRole, existingRole])).toBeTruthy();
      expect(localVue.$auth.token()).toEqual(sampleToken);
      expect(localVue.$auth.user()).toEqual(sampleUser);
      expect(localVue.$auth.roles()).toEqual(sampleUser.roles);
      expect((localVue.router as any).history.getCurrentLocation()).toEqual(options.loginData!.redirect);
      localVue.router.push('/');
      expect((localVue.router as any).history.getCurrentLocation()).toEqual('/');
    });
    it('Info in localStorage', () => {
      expect(localStorage.getItem(options.tokenDefaultName!)).toEqual(sampleToken);
      expect(localStorage.getItem(options.userDefaultName!)).toEqual(JSON.stringify(sampleUser));
    });
    it('Info in sessionStorage', () => {
      expect(sessionStorage.getItem(options.tokenDefaultName!)).toEqual(sampleToken);
      expect(sessionStorage.getItem(options.userDefaultName!)).toEqual(JSON.stringify(sampleUser));
    });
    it('Info in cookies', () => {
      const matchToken = document.cookie.match(new RegExp(`(^| )${options.tokenDefaultName}=([^;]+)`));
      expect(matchToken).not.toBeNull();
      expect(matchToken && matchToken[2]).toEqual(`"${sampleToken}"`);
      const matchUser = document.cookie.match(new RegExp(`(^| )${options.userDefaultName}=([^;]+)`));
      expect(matchUser).not.toBeNull();
      expect(matchUser && matchUser[2]).toEqual(JSON.stringify(sampleUser));
    });
    it('Info in vuex', () => {
      expect(localVue.store.getters[`${options.vuexStoreSpace}/getToken`]).toEqual(sampleToken);
      expect(localVue.store.getters[`${options.vuexStoreSpace}/getUser`]).toEqual(sampleUser);
    });
    it('Fetch User', async () => {
      await localVue.$auth.fetchUser();
      expect(localVue.$auth.user()).toEqual(sampleUser);
    });
    it('Refresh data', async () => {
      const previousToken = localVue.$auth.token();
      await localVue.$auth.refresh();
      expect(localVue.$auth.token()).not.toEqual(previousToken);
    });
    describe('Logout', () => {
      beforeAll(() => {
        mock.reset();
        mock.onPost(`${localVue.axios.defaults.baseURL}${options.logoutData!.url}`)
          .reply(200, { response: true });
      });
      it('Logout result', async () => {
        await localVue.$auth.logout();
        expect((localVue.router as any).history.getCurrentLocation()).toEqual('/login');
        expect(localVue.$auth.check()).toBeFalsy();
        expect(localVue.$auth.check(sampleUser[options.rolesVar!][0])).toBeFalsy();
        expect(localVue.$auth.token()).toBeNull();
        expect(localVue.$auth.user()).toBeNull();
      });
      it('Info in localStorage', () => {
        expect(localStorage.getItem(options.tokenDefaultName!)).toBeNull();
        expect(localStorage.getItem(options.userDefaultName!)).toBeNull();
      });
      it('Info in sessionStorage', () => {
        expect(sessionStorage.getItem(options.tokenDefaultName!)).toBeNull();
        expect(sessionStorage.getItem(options.userDefaultName!)).toBeNull();
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

  describe('Login with fetch user data', () => {
    const spyFetch = jest.fn();
    beforeAll(() => {
      const opts = { ...options };
      opts.loginData!.fetchData = () => {
        spyFetch();
      };
      reset(opts);
    });
    it('Login with fetch user data in login response', async () => {
      mock.reset();
      const loginHeaders = { [options.loginData!.headerToken!.toLowerCase()]: `${options.tokenType} ${sampleToken}` };
      mock.onPost(`${localVue.axios.defaults.baseURL}${options.loginData!.url}`)
        .reply(200, { response: true }, loginHeaders);

      try {
        const response = await localVue.$auth.login({ username: 'test', password: 'test' });
        expect(response).toBeTruthy();
        expect(spyFetch).toHaveBeenCalledTimes(1);
      } catch (_) {
        fail('Login is good');
      }
    });
  });
});

