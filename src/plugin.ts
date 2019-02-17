import Vue from 'vue';
import plugin from './index';
import { VueAuthOptions } from './interfaces';

Vue.use<VueAuthOptions>(plugin, {});

export default plugin;
