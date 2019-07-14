import Vue from 'vue';
import VueAxios from 'vue-axios';
import axios from 'axios';

// --------------------------------------------------------------------
// vue-axios CONFIGURATION
// --------------------------------------------------------------------
const instance = axios.create({
  baseURL: 'http://localhost:6001',
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'Content-type': 'application/json',
  },
});

Vue.use(VueAxios, instance);
