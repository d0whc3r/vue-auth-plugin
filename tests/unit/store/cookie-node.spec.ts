/**
 * @jest-environment node
 */

// @ts-ignore
import Cookies from 'js-cookie';
import StoreCookie from '../../../src/lib/store/store-cookie';
import { createLocalVue } from '@vue/test-utils';
import { Vue, VueConstructor } from 'vue/types/vue';
import { IVueAuthOptions } from '../../../src/lib/auth';
import { AuthUser } from '../../../src/interfaces';

type VueCookie = (Vue | VueConstructor) & { cookie?: any };

let options: IVueAuthOptions;
let vue: VueCookie;
let storeCookie: StoreCookie;
const user: AuthUser = {
  username: 'demo',
  login: 'demouser',
  email: 'demo@demo',
  roles: ['ROLE_ADMIN', 'ROLE_USER'],
};
const token = 'asdf123456asdf';

describe('Node environment', () => {
  beforeEach(() => {
    vue = createLocalVue();
    options = {
      tokenDefaultName: 'token_cookie',
      userDefaultName: 'user_cookie',
      rolesVar: 'roles',
      Vue: vue as any,
    };
  });
  beforeEach(() => {
    vue.cookie = undefined;
    storeCookie = new StoreCookie(vue, options);
  });
  it('No cookies', () => {
    expect(storeCookie.enabled).toBeFalsy();
  });
  it('Set User', () => {
    storeCookie.setUser(user);
    expect(Cookies.get(options.userDefaultName)).toBeUndefined();
    expect(Cookies.get(options.tokenDefaultName)).toBeUndefined();
    expect(storeCookie.getUser()).toBeUndefined();
    expect(storeCookie.getRoles()).toBeUndefined();
  });
  it('Set Token', () => {
    storeCookie.setToken(token);
    expect(Cookies.get(options.tokenDefaultName)).toBeUndefined();
    expect(Cookies.get(options.userDefaultName)).toBeUndefined();
    expect(storeCookie.getToken()).toBeUndefined();
  });
  it('Remove User', () => {
    storeCookie.setUser(user);
    storeCookie.setUser(null);
    expect(Cookies.get(options.userDefaultName)).toBeUndefined();
    expect(storeCookie.getUser()).toBeUndefined();
    expect(storeCookie.getRoles()).toBeUndefined();
  });
  it('Remove Token', () => {
    storeCookie.setToken(token);
    storeCookie.setToken(null);
    expect(Cookies.get(options.tokenDefaultName)).toBeUndefined();
    expect(storeCookie.getToken()).toBeUndefined();
  });
});
