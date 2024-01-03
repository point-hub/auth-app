import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/app.vue'),
      children: [
        {
          path: '',
          redirect: '/auth/signin'
        }
      ]
    },
    {
      path: '/auth',
      children: [
        {
          path: 'signin',
          component: () => import('@/pages/auth/signin.vue')
        },
        {
          path: 'signup',
          component: () => import('@/pages/auth/signup.vue')
        },
        {
          path: 'forgot-password',
          component: () => import('@/pages/auth/forgot-password.vue')
        },
        {
          path: 'reset-password',
          component: () => import('@/pages/auth/reset-password.vue')
        }
      ]
    }
  ]
})

export default router
