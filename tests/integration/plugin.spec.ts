import plugin from '../../src/index';
import { LocalVueType, prepareVue } from '../helper/prepare';

let localVue: LocalVueType;

describe('Plugin', () => {
  beforeEach(() => {
    localVue = prepareVue();
  });
  it('Minimum dependencies', () => {
    localVue.use(plugin);
    expect(localVue.store).toBeDefined();
    expect(localVue.router).toBeDefined();
    expect(localVue.axios).toBeDefined();
    expect(localVue.$auth).toBeDefined();
  });
  it('All undefined before login', () => {
    localVue.use(plugin);
    expect(localVue.$auth.check()).toBeFalsy();
    expect(localVue.$auth.token()).toBeNull();
    expect(localVue.$auth.user()).toBeNull();
  });
});
