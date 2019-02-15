import { VueAuthOptions } from '@/interfaces/VueAuthOptions';
import { VueConstructor } from 'vue';
import StoreLocalStorage from '@/lib/store/store-local-storage';

export default class StoreSessionStorage extends StoreLocalStorage {
  public store: Storage;

  constructor(private Vue: VueConstructor, private options: VueAuthOptions) {
    super(Vue, options);
    this.store = window.sessionStorage;
  }

}
