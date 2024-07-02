export default {
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
          component: () => import('@/pages/credentials/api-keys/detail/index.vue')
        }
      ]
    },
    {
      path: 'oauth2s',
      children: [
        {
          path: '',
          component: () => import('@/pages/credentials/oauth2s/list/index.vue')
        },
        {
          path: 'create',
          component: () => import('@/pages/credentials/oauth2s/create/index.vue')
        },
        {
          path: ':id',
          component: () => import('@/pages/credentials/oauth2s/detail/index.vue')
        }
      ]
    },
    {
      path: 'oauth-consent-screen',
      children: [
        {
          path: '',
          component: () => import('@/pages/credentials/oauth-consent-screen/index.vue')
        }
      ]
    }
  ]
}
