import Vue from 'vue';
import Router from 'vue-router';
import Login from '../Login.vue';
import User from '../User.vue';
import Logout from '../Logout.vue';
// --------------------------------------------------------------------
// vue-router CONFIGURATION
// --------------------------------------------------------------------

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  base: '/',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      name: 'user',
      meta: {
        auth: true,
      },
      component: User,
    },
    {
      path: '/logout',
      component: Logout,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});

(Vue as any).router = router;

export default router;
