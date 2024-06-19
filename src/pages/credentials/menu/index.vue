<script setup lang="ts">
import AppMenu from '@/components/app-menu.vue'

const breadcrumbs = [
  {
    name: 'Menu',
    path: '/menu'
  },
  {
    name: 'Credentials'
  }
]

const menus = [
  {
    name: 'API Keys',
    path: '/credentials/api-keys',
    icon: 'i-far-key'
  },
  {
    name: 'OAuth 2.0',
    path: '/credentials/oauth2',
    icon: 'i-far-user-shield'
  },
  {
    name: 'OAuth Consent Screen',
    path: '/credentials/oauth-consent-screen',
    icon: 'i-far-gallery-thumbnails'
  }
]
</script>

<template>
  <app-menu :breadcrumbs="breadcrumbs" :menus="menus" />
</template>
