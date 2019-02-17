import { createLocalVue, shallowMount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';
import plugin from '../../src/index';

describe('Plugin', () => {
  it('should be 2', () => {
    const localVue = createLocalVue();
    localVue.use(plugin);
    expect(wrapper.vm.$auth).toB;
  });
});
