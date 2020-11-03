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
    meta: { notLoggedIn: true },
    component: LogIn
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: { needsAuth: true },
    component: Dashboard
  },
  {
    path: '/admin-panel',
    meta: { needsAuth: true, adminOnly: true },
    component: AdminPanel
  },
  {
    path: '/work-list',
    meta: { needsAuth: true },
    component: WorkList
  },
  {
    path: '/:notFound(.*)',
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
  if (to.meta.needsAuth && !store.getters.accessToken) {
    router.replace('/');
  }
  // if access token is present go to home page
  else if (to.meta.notLoggedIn && store.getters.accessToken) {
    router.replace('/dashboard');
  }
  // if going to admin page and is not admin
  else if (to.meta.adminOnly && !store.getters.isAdmin) {
    router.replace('/dashboard');
  } else next();
});

export default router;
