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
