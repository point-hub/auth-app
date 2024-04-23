<script setup lang="ts">
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
    name: 'API Keys'
  }
]
</script>

<template>
  <base-card class="py-3!">
    <base-breadcrumb :items="breadcrumbs" separator="angle" v-slot="{ item }">
      <router-link v-if="item.path" :to="item.path">
        {{ item.name }}
      </router-link>
      <span v-else>{{ item.name }}</span>
    </base-breadcrumb>
  </base-card>
</template>
