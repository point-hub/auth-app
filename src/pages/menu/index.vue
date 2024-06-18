<script setup lang="ts">
const breadcrumbs = [
  {
    name: 'Menu'
  }
]

const links = [
  {
    name: 'Home',
    description: 'The main web page of this application',
    path: '/home'
  },
  {
    name: 'Credentials',
    description:
      'Credentials is an authentication process about proving that you are who you say you are.',
    path: '/credentials'
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

    <div class="grid cols-1 lg:cols-2 xl:cols-3 gap-4">
      <base-button size="none" v-for="link in links" :key="link">
        <router-link :to="link.path" class="w-full">
          <base-card class="p-3! h-32">
            <h2 class="line-clamp-1">{{ link.name }}</h2>
            <p class="line-clamp-3 text-sm">{{ link.description }}</p>
          </base-card>
        </router-link>
      </base-button>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
