import { VueConstructor } from 'vue';
import StoreLocalStorage from '../../lib/store/store-local-storage';
import { IVueAuthOptions } from '../auth';

export default class StoreSessionStorage extends StoreLocalStorage {
  constructor(protected Vue: VueConstructor, protected options: IVueAuthOptions) {
    super(Vue, options);
    this.store = window.sessionStorage;
    this.initVue();
  }

}
