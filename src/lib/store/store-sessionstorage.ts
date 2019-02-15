import { VueAuthOptions } from '@/interfaces/VueAuthOptions';
import { VueConstructor } from 'vue';
import StoreLocalstorage from '@/lib/store/store-localstorage';

export default class StoreSessionstorage extends StoreLocalstorage {
  public store: Storage;

  constructor(private Vue: VueConstructor, private options: VueAuthOptions) {
    super(Vue, options);
    this.store = window.sessionStorage;
  }

}
