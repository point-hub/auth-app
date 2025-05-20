<script setup lang="ts">
import { onMounted, ref } from 'vue'

import AppMenu from '@/components/app-menu.vue'
// import { useAuthStore } from '@/stores/auth.store'

// const authStore = useAuthStore()

const breadcrumbs = []

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const menus = ref<any[]>([])

onMounted(() => {
  menus.value.push({
    name: 'My Account',
    path: '/my-account',
    icon: 'i-far-address-card'
  })
})
</script>

<template>
  <app-menu :breadcrumbs="breadcrumbs" v-model:menus="menus" />
</template>
