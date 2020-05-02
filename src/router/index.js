import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/survey/:id([1-3])',
    name: 'Survey',
    component: () => import('../views/Survey.vue'),
  },
  {
    path: '/video/:id([1-3])',
    name: 'Video',
    component: () => import('../views/Video.vue'),
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
