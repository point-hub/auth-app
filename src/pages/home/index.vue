<script setup lang="ts">
const breadcrumbs = [
  {
    name: 'Menu',
    path: '/menu'
  },
  {
    name: 'Home'
  }
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <base-card class="py-3!">
      <base-breadcrumb :items="breadcrumbs" separator="angle" v-slot="{ item }">
        <router-link v-if="item.path" :to="item.path">
          {{ item.name }}
        </router-link>
        <span v-else>{{ item.name }}</span>
      </base-breadcrumb>
    </base-card>
  </div>
</template>

<style scoped lang="postcss"></style>
