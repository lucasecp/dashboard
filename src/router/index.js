import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home/Home.vue';
import Auth from '../views/auth/Auth.vue';
import MainRoutes from '../components/main/routes';
import beforeEach from './beforeEach'
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Auth',
    component: Auth,
  },
  {
    path: '/dashboard',
    name: 'Home',
    component: Home,
    children: [...MainRoutes],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach(beforeEach);

export default router;
