import { createLocalVue, shallowMount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';
import plugin from '../../src/index';

describe('Plugin', () => {
  it('should be 2', () => {
    const msg = 'new message';
    const localVue = createLocalVue();
    localVue.use(plugin);
    const wrapper = shallowMount(HelloWorld, {
      localVue,
      propsData: { msg },
    });
    expect(wrapper.vm.$add(1, 1)).toBe(2);
  });
});
