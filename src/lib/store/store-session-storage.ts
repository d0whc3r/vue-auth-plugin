import { VueConstructor } from 'vue';
import { VueAuthOptions } from '../../interfaces/VueAuthOptions';
import StoreLocalStorage from '../../lib/store/store-local-storage';

export default class StoreSessionStorage extends StoreLocalStorage {
  public store: Storage;

  constructor(protected Vue: VueConstructor, protected options: VueAuthOptions) {
    super(Vue, options);
    this.store = window.sessionStorage;
  }

}
