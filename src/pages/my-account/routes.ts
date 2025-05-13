export default {
  path: 'my-account',
  children: [
    {
      path: '',
      component: () => import('@/pages/my-account/index.vue'),
      meta: { requiresAuth: true }
    }
  ]
}
