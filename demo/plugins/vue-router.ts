import Vue from 'vue';
import Router from 'vue-router';
import Login from '../Login.vue';
import User from '../User.vue';
import Logout from '../Logout.vue';
import Admin from '../Admin.vue';
// --------------------------------------------------------------------
// vue-router CONFIGURATION
// --------------------------------------------------------------------

Vue.use(Router);

const router = new Router({
  mode: 'history',
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
      path: '/user',
      name: 'user',
      meta: {
        auth: 'ROLE_ADMIN',
      },
      component: User,
    },
    {
      path: '/admin',
      meta: {
        auth: true,
      },
      component: Admin,
      children: [
        {
          path: '',
          name: 'admin1',
          meta: {
            auth: ['ROLE_ADMIN'],
          },
          component: User,
        },
        {
          path: 'auth',
          name: 'admin2',
          meta: {
            auth: ['ROLE_UNKNOWN'],
          },
          component: User,
        },
      ],
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
