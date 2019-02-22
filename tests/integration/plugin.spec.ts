import plugin from '../../src/index';
import { prepareVue } from '../helper/prepare';
import MockAdapter from 'axios-mock-adapter';

let localVue;

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
