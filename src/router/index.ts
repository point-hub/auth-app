import { createRouter, createWebHistory } from 'vue-router'

import authRoutes from '@/pages/auth/routes'
import credentialRoutes from '@/pages/credentials/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/app.vue'),
      children: [
        {
          path: '',
          redirect: '/home'
        },
        {
          path: 'home',
          component: () => import('@/pages/home/index.vue')
        },
        {
          path: 'menu',
          component: () => import('@/pages/menu/index.vue')
        },
        credentialRoutes
      ]
    },
    authRoutes,
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/pages/404.vue')
    }
  ]
})

export default router
