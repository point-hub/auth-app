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
        {
          path: 'credentials',
          children: [
            {
              path: '',
              component: () => import('@/pages/credentials/menu/index.vue')
            },
            {
              path: 'api-keys',
              children: [
                {
                  path: '',
                  component: () => import('@/pages/credentials/api-keys/list/index.vue')
                },
                {
                  path: 'create',
                  component: () => import('@/pages/credentials/api-keys/create/index.vue')
                },
                {
                  path: ':id',
                  component: () => import('@/pages/credentials/api-keys/create/index.vue')
                },

                {
                  path: ':id/update',
                  component: () => import('@/pages/credentials/api-keys/update/index.vue')
                }
              ]
            },
            {
              path: 'oauth2',
              children: [
                {
                  path: '',
                  component: () => import('@/pages/credentials/oauth2/list/index.vue')
                },
                {
                  path: 'create',
                  component: () => import('@/pages/credentials/oauth2/create/index.vue')
                },
                {
                  path: ':id',
                  component: () => import('@/pages/credentials/oauth2/create/index.vue')
                },

                {
                  path: ':id/update',
                  component: () => import('@/pages/credentials/oauth2/update/index.vue')
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/auth',
      component: () => import('../layouts/auth.vue'),
      children: [
        {
          path: '',
          redirect: 'auth/signin'
        },
        {
          path: 'signin',
          component: () => import('@/pages/auth/signin/index.vue')
        },
        {
          path: 'signup',
          component: () => import('@/pages/auth/signup/index.vue')
        },
        {
          path: 'verify-email',
          component: () => import('@/pages/auth/verify-email/index.vue')
        },
        {
          path: 'forgot-password',
          component: () => import('@/pages/auth/forgot-password/index.vue')
        },
        {
          path: 'reset-password',
          component: () => import('@/pages/auth/reset-password/index.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/pages/404.vue')
    }
  ]
})

export default router
