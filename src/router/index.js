import Vue from 'vue';
import VueRouter from 'vue-router';
// import { getLatestCompletedStep, clearStorage } from '@/utils/local-storage';
// import steps from '@utils/steps';
// const stepPaths = Object.keys(stepPaths);

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
    path: '/submit',
    name: 'Submit',
    component: () => import('../views/Submit.vue'),
  },
  {
    path: '/thanks',
    name: 'Thanks',
    component: () => import('../views/Thanks.vue'),
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

//
// router.beforeEach((to, from, next) => {
//   const latestCompletedStep = getLatestCompletedStep();
//
//   if (to.path === '/') {
//     // User allowed to navigate to index whenever,
//     // even in the middle of participating,
//     // but in that case all data is erased
//     // and the user has to start all over
//     if (latestCompletedStep) {
//       clearStorage();
//     }
//     console.log('index, next()');
//     return next();
//   }
//
//   const isNextStep = (stepPaths.indexOf(to.path) - stepPaths.indexOf(latestCompletedStep)) === 1;
//
//   if (isNextStep && latestCompletedStep) {
//     // User allowed to continue to the next step
//     // if previous step is completed
//     console.log('next step, next()');
//     return next();
//   }
//
//   // User not allowed to navigate manually at all
//   console.log('not allowed, next(false)');
//   return next(false);
// });
export default router;
