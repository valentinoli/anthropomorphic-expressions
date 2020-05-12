import Vue from 'vue';
import VueRouter from 'vue-router';
import { getLatestCompletedStep, getSubmitted } from '@/utils/local-storage';
import steps from '@/utils/steps';

const stepPaths = Object.keys(steps);

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/general',
    name: 'General',
    component: () => import('../views/General.vue'),
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
  scrollBehavior() {
    // Scroll to top
    return { x: 0, y: 0 };
  },
});


router.beforeEach((to, from, next) => {
  const latestCompletedStep = getLatestCompletedStep();
  const submitted = getSubmitted();

  if (submitted && to.path === '/thanks') {
    return next();
  }

  if ((!latestCompletedStep || latestCompletedStep === '/')
      && to.path === '/') {
    // User allowed to navigate to index,
    // but not during the experiment
    return next();
  }

  const isNextStep = (stepPaths.indexOf(to.path) - stepPaths.indexOf(latestCompletedStep)) === 1;

  if (isNextStep && latestCompletedStep) {
    // User allowed to continue to the next step
    // if previous step is completed
    return next();
  }

  if (latestCompletedStep) {
    const currentStep = stepPaths[stepPaths.indexOf(latestCompletedStep) + 1];

    if (currentStep === to.path) {
      // Allow user to stay on current step
      return next();
    }

    // User might have tried to navigate manually
    // to another endpoint. Navigate him back.
    return next(currentStep);
  }

  // Otherwise, user not allowed to navigate manually at all
  return next(false);
});

export default router;
