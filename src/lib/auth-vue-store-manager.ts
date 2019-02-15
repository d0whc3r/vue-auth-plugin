import { VueConstructor } from 'vue';
import { VueAuthOptions } from '@/interfaces/VueAuthOptions';

export class AuthStoreManager {
  constructor(private Vue: VueConstructor, private options: VueAuthOptions) {
  }

  getStores() {
    return [...this.options.tokenStore]
      .map((store) => {
        switch (store) {
          case 'cookie':
            break;
          case 'vuex':
            break;
          default:
        }
      });
  }

}
