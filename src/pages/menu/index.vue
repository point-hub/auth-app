<script setup lang="ts">
import AppMenu from '@/components/app-menu.vue'

const breadcrumbs = [
  {
    name: 'Menu'
  }
]

const menus = [
  {
    name: 'Home',
    path: '/',
    icon: 'i-far-house'
  },
  {
    name: 'Credentials',
    path: '/credentials',
    icon: 'i-far-lock'
  }
]
</script>

<template>
  <app-menu :breadcrumbs="breadcrumbs" :menus="menus" />
</template>
