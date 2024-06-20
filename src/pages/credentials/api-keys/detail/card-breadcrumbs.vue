<script setup lang="ts">
const id = defineModel<string>('id', { required: true })

import AppBreadcrumb from '@/components/app-breadcrumb.vue'

const breadcrumbs = [
  {
    name: 'Menu',
    path: '/menu'
  },
  {
    name: 'Credentials',
    path: '/credentials'
  },
  {
    name: 'API Keys',
    path: '/credentials/api-keys'
  },
  {
    name: `${id.value}`
  }
]
</script>

<template>
  <app-breadcrumb :breadcrumbs="breadcrumbs" />
</template>
