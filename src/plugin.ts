/*
 * NOTE:
 *   This file is plugin stub for main.ts
 */

import Vue from 'vue';
import plugin, { VueAuthOptions } from './index';

Vue.use<VueAuthOptions>(plugin);

/*
 * NOTE:
 *   If you want Vue instance of main.ts to import something in your plugin as a Vue option,
 *   you need to export it here.
 */
export default plugin;
