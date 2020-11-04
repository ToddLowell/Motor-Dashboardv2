import store from '../store/index.js';
import Vue from 'vue';
import VueRouter from 'vue-router';
import LogIn from '../views/LogIn.vue';
import Dashboard from '../views/Dashboard.vue';
import WorkList from '../views/WorkList.vue';
import AdminPanel from '../views/AdminPanel.vue';
import Error404 from '../views/404.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'LogIn',
    meta: { title: 'Sign In', notLoggedIn: true },
    component: LogIn
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: { title: 'Dashboard', needsAuth: true },
    component: Dashboard
  },
  {
    path: '/admin-panel',
    meta: { title: 'Admin Panel', needsAuth: true, adminOnly: true },
    component: AdminPanel
  },
  {
    path: '/work-list',
    meta: { title: 'Work List', needsAuth: true },
    component: WorkList
  },
  {
    path: '/:notFound(.*)',
    meta: { title: 'Page not Found' },
    component: Error404
  }
];

const router = new VueRouter({
  routes,

  scrollBehavior(to, from, savedPosition) {
    // if previous position exits when pressing back button
    if (savedPosition) {
      return savedPosition;
    }

    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  // if needs auth and has no access token go to login page
  if (to.meta.needsAuth && !localStorage.getItem('accessToken')) {
    router.replace('/');
  }
  // if access token is present go to home page
  else if (to.meta.notLoggedIn && localStorage.getItem('accessToken')) {
    router.replace('/dashboard');
  }
  // if going to admin page and is not admin
  else if (to.meta.adminOnly && !store.getters.isAdmin) {
    router.replace('/dashboard');
  } else next();
});

const DEFAULT_TITLE = 'MIMOS Motor Dashboard';

router.afterEach(to => {
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
});

export default router;
