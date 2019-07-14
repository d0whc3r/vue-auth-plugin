import plugin from '../../src/index';
import { LocalVueType, prepareVue } from '../helper/prepare';

let localVue: LocalVueType;

describe('Plugin', () => {
  beforeEach(() => {
    localVue = prepareVue();
  });
  it('Minimum dependencies', () => {
    localVue.use(plugin);
    expect(localVue.store).toBeTruthy();
    expect(localVue.router).toBeTruthy();
    expect(localVue.axios).toBeTruthy();
    expect(localVue.$auth).toBeTruthy();
  });
  it('All undefined before login', () => {
    localVue.use(plugin);
    expect(localVue.$auth.check()).toBeFalsy();
    expect(localVue.$auth.token()).toBeNull();
    expect(localVue.$auth.user()).toBeNull();
  });
});
