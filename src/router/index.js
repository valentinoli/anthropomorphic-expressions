import { createRouter, createWebHashHistory } from 'vue-router'

import { getLatestCompletedStep, getSubmitted } from '@/utils/local-storage'
import steps from '@/utils/steps'

const stepPaths = Object.keys(steps)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/general',
    name: 'General',
    component: () => import('../views/General.vue')
  },
  {
    path: '/survey/:id([1-2])',
    name: 'Survey',
    component: () => import('../views/Survey.vue')
  },
  {
    path: '/video/:id([1-2])',
    name: 'VideoPlayer',
    component: () => import('../views/VideoPlayer.vue')
  },
  {
    path: '/questionnaire/aq10',
    component: () => import('../views/QuestionnaireAQ10.vue')
  },
  {
    path: '/questionnaire/spqb',
    component: () => import('../views/QuestionnaireSPQB.vue')
  },
  {
    path: '/submit',
    name: 'Submit',
    component: () => import('../views/Submit.vue')
  },
  {
    path: '/thanks',
    name: 'Thanks',
    component: () => import('../views/Thanks.vue')
  },
  {
    // pathMatch is the name of the param, e.g., going to /not/found yields
    // { params: { pathMatch: ['not', 'found'] }}
    // this is thanks to the last *, meaning repeated params and it is necessary if you
    // plan on directly navigating to the not-found route using its name
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior () {
    // Scroll to top
    return { left: 0, top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const latestCompletedStep = getLatestCompletedStep()
  const submitted = getSubmitted()

  if (submitted && to.path === '/thanks') {
    return next()
  }

  if ((!latestCompletedStep || latestCompletedStep === '/') &&
    to.path === '/') {
    // User allowed to navigate to index,
    // but not during the experiment
    return next()
  }

  const isNextStep = (stepPaths.indexOf(to.path) - stepPaths.indexOf(latestCompletedStep)) === 1

  if (isNextStep && latestCompletedStep) {
    // User allowed to continue to the next step
    // if previous step is completed
    return next()
  }

  if (latestCompletedStep) {
    const currentStep = stepPaths[stepPaths.indexOf(latestCompletedStep) + 1]

    if (currentStep === to.path) {
      // Allow user to stay on current step
      return next()
    }

    // User might have tried to navigate manually
    // to another endpoint. Navigate him back.
    return next(currentStep)
  }

  // Otherwise, user not allowed to navigate manually at all
  return next(false)
})

export default router
